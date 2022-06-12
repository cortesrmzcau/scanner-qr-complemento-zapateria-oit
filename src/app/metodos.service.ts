import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Cliente, Servos } from './modelo';

@Injectable({
  providedIn: 'root'
})
export class ServicesGeneralService {

  ListaClientes: AngularFireList<any>;
  ListaServos: AngularFireList<any>;
  ListaIntervaloHoras: AngularFireList<any>;
  
  constructor(private firebase: AngularFireDatabase) {}

  ObtenerClientes(){
    this.ListaClientes = this.firebase.list('usuarios');
    return this.ListaClientes;
  }

  ObtenerServos(){
    this.ListaServos = this.firebase.list('Sensores');
    return this.ListaServos;
  }

  ObtenerIntervaloHorasGraficaVisitaHoraDiaActual(){
    this.ListaIntervaloHoras = this.firebase.list('GraficaVisitaDiaActual');
    return this.ListaIntervaloHoras;
  }

  ActualizarServoPuerta($key: string){
    this.ListaServos.update($key,{
      Estado: 'Abierto'
    })
  }

  ActualizarCampoVisitasClientes($key: string, convertirvisita: number,
    FechaUltimaVistia: string, HoraUltimaVisita: number){
    this.ListaClientes.update($key,{
      numerovisitas: convertirvisita + 1,
      ultimavisita: FechaUltimaVistia,
      //FechaUltimaVisitaCorta: FechaCorta,
      hora: HoraUltimaVisita
    });
  }

  ActualizarCampoNumVisitasGraficaVisitasHoraDiaActual($key: string, NumVisitasGrafica: any,
  Hombre?: number, Mujer?: number){
    this.ListaIntervaloHoras.update($key, {
      NumVisitas: NumVisitasGrafica,
      Hombre: Hombre,
      Mujer: Mujer
    });

    //console.log("aaaaa " + NumVisitasGrafica);
  }

}
