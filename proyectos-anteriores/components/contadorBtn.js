import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
// Descestuctura de props = properties
export default function ContadorBtn({ label, position, onPressProp, onLongPressProp }) {
    return (
        <Pressable style={({ pressed }) => [
            styles.buttonFlotante,
            position === 'izquierda' ? styles.buttonFlotanteIzquierdo : styles.buttonFlotanteDerecho, 
            pressed && styles.buttonPressed
        ]}
            onPress={onPressProp}
            onLongPress={onLongPressProp}
        >
            <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        // tus estilos aquí
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonPressed: {
        backgroundColor: '#1c86ee',
    },

    buttonFlotante: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#1e90ff',
        padding: 20,
        borderRadius: 15,
    },

    buttonFlotante: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#1e90ff',
        padding: 20,
        borderRadius: 15,
    },

    buttonFlotanteIzquierdo: {
        left: 20,
    },

    buttonFlotanteDerecho: {
        right: 20,
    },
});