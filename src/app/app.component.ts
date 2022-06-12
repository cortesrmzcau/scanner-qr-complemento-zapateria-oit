import { Component } from '@angular/core';
import { VERSION, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from './modules/zxing-scanner/zxing-scanner.module';
import { Result } from '@zxing/library';
import { Cliente, Servos, IntervalosHoras, usuarios } from '../app/modelo';
import { ServicesGeneralService } from '../app/metodos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    title = 'app';
    public NombreCliente: string;
    public HoraEntrada: string;
    public FechaEntrada: string;

    ObtenerCamposCliente: usuarios[];
    ObtenerCamposServos: Servos[];
    ObtenerCamposIntervalosHoras: IntervalosHoras[];

    constructor(public Metodos: ServicesGeneralService) {}

    ngVersion = VERSION.full;

    @ViewChild('scanner')
    scanner: ZXingScannerComponent;

    hasDevices: boolean;
    hasPermission: boolean;
    qrResultString: string;
    qrResult: Result;

    availableDevices: MediaDeviceInfo[];
    currentDevice: MediaDeviceInfo;

    ngOnInit(): void {
    
        //this.Lista();

        // this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
        //     this.availableDevices = devices;

        //     // selects the devices's back camera by default
        //     for (const device of devices) {
        //         if (/back|rear|environment/gi.test(device.label)) {
        //             this.scanner.changeDevice(device);
        //             this.currentDevice = device;
        //             break;
        //         }
        //     }
        // });

        this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => this.availableDevices = devices);
        this.scanner.hasDevices.subscribe((has: boolean) => this.hasDevices = has);
        this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
        this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
    }

    displayCameras(cameras: MediaDeviceInfo[]) {
        console.debug('Devices: ', cameras);
        this.availableDevices = cameras;
    }

    handleQrCodeResult(resultString: string) {

        this.Metodos.ObtenerClientes().snapshotChanges().subscribe(item => {
            this.ObtenerCamposCliente = [];
            item.forEach(element => {
              let Campos: any = element.payload.toJSON();
              Campos["$key"] = element.key;
              this.ObtenerCamposCliente.push(Campos);
            })

            //console.log(this.ObtenerCamposCliente);
        });

        this.Metodos.ObtenerServos().snapshotChanges().subscribe(item => {
            this.ObtenerCamposServos = [];
            item.forEach(element => {
              let Campos: any = element.payload.toJSON();
              Campos["$key"] = element.key;
              this.ObtenerCamposServos.push(Campos);
            })
        });

        this.Metodos.ObtenerIntervaloHorasGraficaVisitaHoraDiaActual().snapshotChanges().subscribe(item => {
            this.ObtenerCamposIntervalosHoras = [];
            item.forEach(element => {
              let Campos: any = element.payload.toJSON();
              Campos["$key"] = element.key;
              this.ObtenerCamposIntervalosHoras.push(Campos);
            })
        });

        this.qrResultString = resultString;

        for(var x of this.ObtenerCamposCliente){
            if(this.qrResultString == x['$key']){
                console.log("Existe");
                for(var y of this.ObtenerCamposServos){
                    if(y['Colocacion'] == "Puerta"){
                        
                        // Fecha
                        var Meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
                        var MesesCorto = new Array("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
                        var Fecha = new Date();
                        var Dia;

                        if(Fecha.getDate()<10){
                            Dia = "0" + Fecha.getDate();
                        }

                        var FechaGeneral = Dia + " de " + Meses[Fecha.getMonth()] + " de " + Fecha.getFullYear();
                        var FechaCorta = Dia + " de " + MesesCorto[Fecha.getMonth()];
                        //console.log(FechaGeneral);

                        // Hora

                        var Hora = new Date();
                        var HoraUltimaVisita: string = Hora.getHours() + "." + Hora.getMinutes();
                        var Convertir: number = parseFloat(HoraUltimaVisita);
                        //var Convertir: number = 20.2;
                        
                        this.Metodos.ActualizarServoPuerta(y['$key']);
                        
                        this.NombreCliente = x['nombre'];
                        this.HoraEntrada = HoraUltimaVisita;
                        this.FechaEntrada = FechaGeneral;

                        var convertirvisita: number = parseInt(x['numerovisitas']);
                        
                        this.Metodos.ActualizarCampoVisitasClientes
                        (this.qrResultString, convertirvisita,
                        FechaGeneral, Convertir);

                        //console.log("aaaaa " + convertirvisita);

                        //console.log(HoraUltimaVisita);

                        for(var z of this.ObtenerCamposIntervalosHoras){
                            
                            if(Convertir >= 7 && Convertir <= 8){
                                if(z['Hora'] == "7 - 8"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 7 - 8 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }
                            
                            if(Convertir > 8 && Convertir <= 9){
                                if(z['Hora'] === "8 - 9"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 8 - 9 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 9 && Convertir <= 10){
                                if(z['Hora'] === "9 - 10"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 9 - 10 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 10 && Convertir <= 11){
                                if(z['Hora'] === "10 - 11"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 10 - 11 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 11 && Convertir <= 12){
                                if(z['Hora'] === "11 - 12"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 11 - 12 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 12 && Convertir <= 13){
                                if(z['Hora'] === "12 - 13"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 12 - 13 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            console.log(x['sexo']);

                            if(Convertir > 13 && Convertir <= 14){
                                if(z['Hora'] === "13 - 14"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 13 - 14 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);

                                }
                            }

                            if(Convertir > 14 && Convertir <= 15){
                                if(z['Hora'] === "14 - 15"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 14 - 15 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

                                if(x['sexo'] == "Hombre"){
                                    
                                    var hombre = z['Hombre'] + 1;
                                    var mujer = z['Mujer'];
    this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'],
                                    NumVisitasGrafica, parseInt(hombre), parseInt(mujer));
                                    }

                                

                                }
                            }

                            if(Convertir > 15 && Convertir <= 16){
                                if(z['Hora'] === "15 - 16"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 15 - 16 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 16 && Convertir <= 17){
                                if(z['Hora'] === "16 - 17"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 16 - 17 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 17 && Convertir <= 18){
                                if(z['Hora'] === "17 - 18"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 17 - 18 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 19 && Convertir <= 20){
                                if(z['Hora'] === "19 - 20"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 19 - 20 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }

                            if(Convertir > 20 && Convertir <= 21){
                                if(z['Hora'] === "20 - 21"){
                                console.log(z['Hora']);
                                console.log(z['NumVisitas']);
                                console.log(z['$key']);
                                console.log("Se encuentra entre las 20 - 21 ... " + Convertir);

                                var NumVisitasGrafica = z['NumVisitas'] + 1;
                                console.log(NumVisitasGrafica);

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                                }
                            }


                        }
                    }
                }
            }else{
                console.log("No existe");
            }
            /*else{
                for(var z of this.ObtenerCamposIntervalosHoras){

                    if(Convertir >= 7 && Convertir <= 8){
                        if(z['Hora'] == "7 - 8"){
                        console.log(z['Hora']);
                        console.log(z['NumVisitas']);
                        console.log(z['$key']);
                        console.log("Se encuentra entre las 7 - 8 ... " + Convertir);

                        var NumVisitasGrafica = z['NumVisitas'] + 1;

this.Metodos.ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual(z['$key'], NumVisitasGrafica);
                        }
                    }
                    
                }
            }*/
        }
    }

    onDeviceSelectChange(selectedValue: string) {
        console.debug('Selection changed: ', selectedValue);
        this.currentDevice = this.scanner.getDeviceById(selectedValue);
    }

    stateToEmoji(state: boolean): string {

        const states = {
            // not checked
            undefined: '❔',
            // failed to check
            null: '⭕',
            // success
            true: '✔',
            // can't touch that
            false: '❌'
        };

        return states['' + state];
    }

}
