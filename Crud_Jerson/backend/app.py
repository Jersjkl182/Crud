from flask import Flask  # para crear un servidor
from flask_cors import CORS  # añade el CORS
from flask import jsonify, request  # para poder exportar archivos en json
import pymysql  # conectar con mysql

app = Flask(__name__) 
CORS(app) 

# conectar la base de datos
def conectar(vhost, vuser, vpass, vdb):
    conn = pymysql.connect(host=vhost, user=vuser, passwd=vpass, db=vdb, charset='utf8mb4')  # Conexión MySQL
    return conn 

# ver los registros
@app.route("/")
def consulta_general():
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')  # Conecta con la base de datos
        cur = conn.cursor() 
        cur.execute("""SELECT * FROM baul""")  # Consulta todos los registros
        datos = cur.fetchall()  
        data = []  # guarda resultados
        for row in datos: 
            dato = {'id_baul': row[0], 'Plataforma': row[1], 'usuario': row[2], 'clave': row[3]}
            data.append(dato) 
        cur.close()  
        conn.close() 
        return jsonify({'baul': data, 'mensaje': 'Baul de contraseñas'})  # Da los datos como archivo json
    except Exception as ex:
        return jsonify({'mensaje': 'Error'})  # Mensaje de error

# Consulta individual
@app.route("/consulta_individual/<codigo>", methods=['GET'])
def consulta_individual(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')  # Conecta a la base de datos
        cur = conn.cursor() 
        cur.execute("""SELECT * FROM baul WHERE id_baul = %s""", (codigo,))  # Consulta un registro
        datos = cur.fetchone()  # Obtiene un registro
        cur.close()  
        conn.close() 
        if datos is not None:
            dato = {'id_baul': datos[0], 'Plataforma': datos[1], 'usuario': datos[2], 'clave': datos[3]} 
            return jsonify({'baul': dato, 'mensaje': 'Registro encontrado'}) 
        else:
            return jsonify({'mensaje': 'Registro no encontrado'})  # por si no se encuentra el registro
    except Exception as ex:
        return jsonify({'mensaje': 'Error'})  # mensaje de error en caso de no estar bien conectado

# Registra en la base de datos
@app.route("/registro/", methods=['POST'])
def registro():
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')  # Conecta con la base de datos
        cur = conn.cursor()
        x = cur.execute("""INSERT INTO baul (plataforma, usuario, clave) VALUES ('{0}', '{1}', '{2}')""".format(
            request.json['plataforma'],  # toma la plataforma
            request.json['usuario'],  # toma el usuario
            request.json['clave']  # toma la clave
        ))
        conn.commit()  
        cur.close()  
        conn.close()  
        return jsonify({'mensaje': 'Registro agregado'})  # Mensaje de guardado 
    except Exception as ex:
        print(ex)  # manda a mostrar el error en caso de que no se guarde 
        return jsonify({'mensaje': 'Error'})  # Mensaje de error en archivo json

# Elimina de la base de datos
@app.route("/eliminar/<codigo>", methods=['DELETE'])
def eliminar(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')  # Conecta con la base de datos
        cur = conn.cursor() 
        cur.execute("""DELETE FROM baul WHERE id_baul = {0}""".format(codigo))  # Elimina el registro
        conn.commit() 
        cur.close()  
        conn.close()  
        return jsonify({'mensaje': 'Eliminado'})  # Mensaje de eliminado
    except Exception as ex:
        print(ex)  # Imprime el error en caso de que no se elimine 
        return jsonify({'mensaje': 'Error'})  # Mensaje de error en archivo json

# Actualiza de la base de datos
@app.route("/actualizar/<codigo>", methods=['PUT'])
def actualizar(codigo):
    try:
        conn = conectar('localhost', 'root', '', 'gestor_contrasena')  # Conecta con la base de datos
        cur = conn.cursor()  
        # Actualiza los datos subministrados de la base de datos
        x = cur.execute("""UPDATE baul SET plataforma = '{0}', usuario = '{1}', clave = '{2}' WHERE id_baul = {3}""".format(
            request.json['plataforma'], 
            request.json['usuario'],  
            request.json['clave'],  
            codigo 
        ))
        conn.commit() 
        cur.close() 
        conn.close() 
        return jsonify({'mensaje': 'Registro actualizado'})  # Mensaje de actulizado
    except Exception as ex:
        print(ex)  # Imprime el error en caso de no actualizarse
        return jsonify({'mensaje': 'Error'})  # Mensaje de error en archivo json

# Inicia el servidor flask
if __name__ == "__main__":
    app.run(debug=True)  

            
