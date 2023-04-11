import { options } from "../src/mysqlDB.js";
import knex from 'knex';

const knexConnection = knex(options);


// mensajes y productos en SQLite3

    try {
        // _01
        console.log('Iniciando Script...');
        await knexConnection.schema.dropTableIfExists('products');
        await knexConnection.schema.dropTableIfExists('messages');

        // _02 
        console.log('Creando tabla...');
        await knexConnection.schema.createTable('products', table =>{
            table.increments('id').primary();
            table.string('title').notNullable()
            table.float('price')
            table.string('thumbnail').notNullable()
        });

        await knexConnection.schema.createTable('messages', (table) => {
            table.increments("id").primary()
            table.string("user").notNullable()
            table.string("date").notNullable()
            table.string("message").notNullable()
        });
        console.log('tabla mensajes en sqlite3 creada con éxito')

        // _03 Pusheo los datos que ya tengo en formato txt
        console.log('insertando registros');
        const products = [
            {
              title: "Escuadra",
              price: 123.45,
              thumbnail:
                "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
            },
            {
              title: "Calculadora",
              price: 234.56,
              thumbnail:
                "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
            },
            {
              title: "Reloj",
              price: 345.67,
              thumbnail:
                "https://cdn4.iconfinder.com/data/icons/azullustre-mayosoft/AzulLustre_icons/256/Reloj_arena.png"
            },
            {
              title: "Pizza",
              price: "234",
              thumbnail:
                "https://media.istockphoto.com/photos/cheesy-pepperoni-pizza-picture-id938742222?k=20&m=938742222&s=612x612&w=0&h=X5AlEERlt4h86X7U7vlGz3bDaDDGQl4C3MuU99u2ZwQ="
            },
            {
              title: "Pizza",
              price: "234",
              thumbnail:
                "https://media.istockphoto.com/photos/cheesy-pepperoni-pizza-picture-id938742222?k=20&m=938742222&s=612x612&w=0&h=X5AlEERlt4h86X7U7vlGz3bDaDDGQl4C3MuU99u2ZwQ="
            },
            {
              title: "jejeje",
              price: "1323",
              thumbnail: "https://dummyimage.com/250/000/fff"
            },
            {
              title: "test",
              price: "12",
              thumbnail:
                "https://img.freepik.com/foto-gratis/disparo-gran-angular-solo-arbol-que-crece-cielo-nublado-puesta-sol-rodeada-cesped_181624-22807.jpg?w=2000"
            },
            {
              title: "jeje",
              price: "12",
              thumbnail:
                "https://img.freepik.com/foto-gratis/disparo-gran-angular-solo-arbol-que-crece-cielo-nublado-puesta-sol-rodeada-cesped_181624-22807.jpg?w=2000"
            },
            {
              title: "Jeje",
              price: "12",
              thumbnail: "https://dummyimage.com/250/000/fff"
            }
          ];
        await knexConnection('products').insert(products)
        const messages = [
            {
              user: "admin@email.com",
              date: "24/11/2022 19:57:22",
              message: "Bienvenido al canal de chat"
            },
            {
              user: "gfchazarreta@mail.com",
              date: "11/24/2022 20:28:23",
              message: "Probando el canal de chat"
            },
            {
              user: "simonellidiego@gmail.com",
              date: "11/25/2022 19:31:42",
              message: "hola como va?"
            },
            {
              user: "wffefe",
              date: "12/01/2022 23:29:00",
              message: "qdwf"
            },
            {
              user: "dsvsds",
              date: "1/12/2022 23:29:00",
              message: "asda"
            }
          ];
        await knexConnection('messages').insert(messages)

        // _04 Mostramos lo guardado
        console.log('los registros guardados son los siguientes...');
        const result1 = await knexConnection('products').select('*')
        const result2 = await knexConnection('messages').select('*')
        console.log(result1);
        console.log(result2);
    } catch (error) {
        console.log(error)
    }
    finally{
        knexConnection.destroy()
    }
