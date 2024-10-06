
export interface Prestamo{
    id?: number;
    Cliente:[
        Cliente
    ];
    monto:number;
    interes:number;
    plazo:number;
  }


export interface Cliente{
    id?: number;
    nombres:string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nacionalidad: string;
    dni: string;
    password?: string;
  }


  export interface Trabajador{
    id?: number;
    nombre: string;
    apellido: string;
    username: string;
    password?: string;
  }