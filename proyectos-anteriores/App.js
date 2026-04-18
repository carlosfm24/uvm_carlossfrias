import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ContadorBtn from './components/contadorBtn';

export default function App() {
  const [contador, setContador] = useState(0);
  const [historial, setHistorial] = useState([]);

  const getColor = () => {
    if (contador > 0) {
      return '#763de7';
    } else if (contador < 0) {
      return '#ef0d0d';
    } else {
      return '#ffffff';
    }
  };

  const agregarHistorial = (nuevoValor) => {
    setHistorial((prev) => {
      const nuevoHistorial = [...prev, nuevoValor];
      return nuevoHistorial.slice(-5);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.titulo, { color: getColor() }]}>Contador App</Text>

      <Text style={[styles.numeracion, { color: getColor() }]}>
        {contador}
      </Text>

      <ContadorBtn
        label="+ 1"
        position="izquierda"
        onPressProp={() => {
          const nuevoValor = contador + 1;
          setContador(nuevoValor);
          agregarHistorial(nuevoValor);
        }}
        onLongPressProp={() => {
          setContador(0);
          setHistorial([]);
        }}
      />

      <ContadorBtn
        label="- 1"
        position="derecha"
        onPressProp={() => {
          const nuevoValor = contador - 1;
          setContador(nuevoValor);
          agregarHistorial(nuevoValor);
        }}
        onLongPressProp={() => {
          setContador(0);
          setHistorial([]);
        }}
      />

      <Text style={[styles.tituloFotter, { color: getColor() }]}>Historial</Text>

      <Text style={[styles.historialItem, { color: getColor() }]}>
        {historial.length > 0 ? historial.join(' , ') : 'Sin valores'}
      </Text>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titulo: {
    position: 'absolute',
    top: 60,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  tituloFotter: {
    position: 'absolute',
    bottom: 240,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  numeracion: {
    fontSize: 240,
    fontWeight: 'bold',
  },

  historialItem: {
    position: 'absolute',
    bottom: 180,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});