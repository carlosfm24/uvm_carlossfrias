import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ScreenType =
  | 'login'
  | 'registro'
  | 'productos'
  | 'favoritos'
  | 'captura'
  | 'estatus';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  status: 'DISPONIBLE' | 'AGOTADO';
  emoji: string;
};

type UserAccount = {
  username: string;
  password: string;
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Audífonos WH-CH520 Rosa', brand: 'Sony', price: 899, status: 'DISPONIBLE', emoji: '🎧' },
  { id: '2', name: 'Audífonos WH-CH520 Negro', brand: 'Sony', price: 899, status: 'DISPONIBLE', emoji: '🎧' },
  { id: '3', name: 'Mouse Inalámbrico M280', brand: 'Logitech', price: 499, status: 'DISPONIBLE', emoji: '🖱️' },
  { id: '4', name: 'Teclado Mecánico K380', brand: 'Logitech', price: 1299, status: 'DISPONIBLE', emoji: '⌨️' },
  { id: '5', name: 'Monitor 24 Full HD', brand: 'Samsung', price: 3299, status: 'DISPONIBLE', emoji: '🖥️' },
  { id: '6', name: 'Laptop IdeaPad 15', brand: 'Lenovo', price: 12499, status: 'DISPONIBLE', emoji: '💻' },
  { id: '7', name: 'Tablet Galaxy Tab A9', brand: 'Samsung', price: 4499, status: 'DISPONIBLE', emoji: '📱' },
  { id: '8', name: 'Bocina Bluetooth Flip', brand: 'JBL', price: 2199, status: 'DISPONIBLE', emoji: '🔊' },
  { id: '9', name: 'Webcam HD 1080p', brand: 'Logitech', price: 999, status: 'DISPONIBLE', emoji: '📷' },
  { id: '10', name: 'Impresora Multifuncional', brand: 'HP', price: 2899, status: 'DISPONIBLE', emoji: '🖨️' },
];

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('login');

  const [accounts, setAccounts] = useState<UserAccount[]>([
    { username: 'admin', password: '1234' },
  ]);

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [registerUser, setRegisterUser] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [inStore, setInStore] = useState<'SI' | 'NO'>('SI');
  const [physicalInventory, setPhysicalInventory] = useState('');
  const [systemInventory, setSystemInventory] = useState('');
  const [price, setPrice] = useState('');
  const [captureError, setCaptureError] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) =>
      `${item.brand} ${item.name}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter((item) => favorites.includes(item.id));
  }, [favorites]);

  const openCapture = (product: Product) => {
    setSelectedProduct(product);
    setPrice(String(product.price));
    setPhysicalInventory('');
    setSystemInventory('');
    setInStore('SI');
    setCaptureError('');
    setScreen('captura');
  };

  const handleSubmit = () => {
    if (
      physicalInventory.trim() === '' ||
      systemInventory.trim() === '' ||
      price.trim() === ''
    ) {
      setCaptureError('Debes capturar todos los campos antes de continuar.');
      return;
    }

    setCaptureError('');
    setScreen('estatus');
  };

  const handleLogin = () => {
    const trimmedUser = usuario.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUser || !trimmedPassword) {
      setLoginError('Captura usuario y contraseña.');
      return;
    }

    if (!acceptedTerms) {
      setLoginError('Debes aceptar términos y condiciones.');
      return;
    }

    const userFound = accounts.find(
      (account) =>
        account.username === trimmedUser && account.password === trimmedPassword
    );

    if (!userFound) {
      setLoginError('Usuario o contraseña incorrectos.');
      return;
    }

    setLoginError('');
    setUsuario('');
    setPassword('');
    setAcceptedTerms(false);
    setScreen('productos');
  };

  const handleRegister = () => {
    const trimmedUser = registerUser.trim();
    const trimmedPassword = registerPassword.trim();

    if (!trimmedUser || !trimmedPassword) {
      setRegisterError('Completa usuario y contraseña.');
      setRegisterSuccess('');
      return;
    }

    const alreadyExists = accounts.some(
      (account) => account.username.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (alreadyExists) {
      setRegisterError('Ese usuario ya existe.');
      setRegisterSuccess('');
      return;
    }

    setAccounts((prev) => [
      ...prev,
      { username: trimmedUser, password: trimmedPassword },
    ]);

    setRegisterError('');
    setRegisterSuccess('Usuario registrado correctamente.');
    setUsuario(trimmedUser);
    setPassword(trimmedPassword);
    setRegisterUser('');
    setRegisterPassword('');
    setShowRegisterPassword(false);
  };

  const goToRegister = () => {
    setRegisterError('');
    setRegisterSuccess('');
    setRegisterUser('');
    setRegisterPassword('');
    setScreen('registro');
  };

  const backToLogin = () => {
    setLoginError('');
    setRegisterError('');
    setRegisterSuccess('');
    setScreen('login');
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require('./assets/images/technologi-logo.png')}
        style={styles.techLogo}
        resizeMode="contain"
      />
      <Image
        source={require('./assets/images/walmart-logo.png')}
        style={styles.walmartLogo}
        resizeMode="contain"
      />
    </View>
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => setScreen('login')}>
        <Text style={styles.navIcon}>⌂</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen('productos')}>
        <Text style={styles.navIcon}>▣</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen('favoritos')}>
        <Text style={styles.navIcon}>♡</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScreen('login')}>
        <Text style={styles.navIcon}>↪</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordField = (
    value: string,
    onChangeText: (text: string) => void,
    visible: boolean,
    onToggle: () => void
  ) => (
    <View style={styles.passwordWrapper}>
      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder=""
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.showButton} onPress={onToggle}>
        <Text style={styles.showButtonText}>{visible ? 'Ocultar' : 'Ver'}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLogin = () => (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        <Text style={styles.title}>Iniciar Sesión</Text>

        <View style={styles.loginCard}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={usuario}
            onChangeText={(text) => {
              setUsuario(text);
              if (loginError) setLoginError('');
            }}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          {renderPasswordField(
            password,
            (text) => {
              setPassword(text);
              if (loginError) setLoginError('');
            },
            showLoginPassword,
            () => setShowLoginPassword((prev) => !prev)
          )}

          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>

          {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Iniciar Sesion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
              <Text style={styles.registerButtonText}>Registrate</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              setAcceptedTerms((prev) => !prev);
              if (loginError) setLoginError('');
            }}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
              {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.termsText}>Acepto terminos y condiciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pixelArea}>
          <View style={[styles.pixel, { top: 10, left: 50, backgroundColor: '#ff1a1a' }]} />
          <View style={[styles.pixel, { top: 55, left: 95, backgroundColor: '#9b001f' }]} />
          <View style={[styles.pixel, { top: 55, left: 120, backgroundColor: '#ff1a1a' }]} />
          <View style={[styles.pixel, { top: 85, left: 120, backgroundColor: '#ff1a1a' }]} />
          <View style={[styles.pixel, { top: 95, left: 165, backgroundColor: '#b00020' }]} />
          <View style={[styles.pixel, { top: 95, left: 210, backgroundColor: '#e3002d' }]} />
          <View style={[styles.pixel, { top: 80, left: 250, backgroundColor: '#c00030' }]} />
        </View>

        <View style={styles.bottomMosaic}>
          {Array.from({ length: 100 }).map((_, index) => {
            const colors = ['#ff0000', '#c40010', '#8a0010', '#ffffff', '#db2b2b'];
            return (
              <View
                key={index}
                style={[
                  styles.mosaicSquare,
                  {
                    backgroundColor: colors[index % colors.length],
                    height: index % 3 === 0 ? 28 : index % 4 === 0 ? 18 : 22,
                  },
                ]}
              />
            );
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderRegister = () => (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        <Text style={styles.title}>Registrate</Text>

        <View style={styles.loginCard}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            style={styles.input}
            value={registerUser}
            onChangeText={(text) => {
              setRegisterUser(text);
              if (registerError) setRegisterError('');
              if (registerSuccess) setRegisterSuccess('');
            }}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          {renderPasswordField(
            registerPassword,
            (text) => {
              setRegisterPassword(text);
              if (registerError) setRegisterError('');
              if (registerSuccess) setRegisterSuccess('');
            },
            showRegisterPassword,
            () => setShowRegisterPassword((prev) => !prev)
          )}

          {!!registerError && <Text style={styles.errorText}>{registerError}</Text>}
          {!!registerSuccess && <Text style={styles.successText}>{registerSuccess}</Text>}

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
              <Text style={styles.loginButtonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={backToLogin}>
              <Text style={styles.registerButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Usuario de prueba actual: admin / 1234
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderProductGrid = (data: Product[], emptyMessage: string) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={[
        styles.productsList,
        data.length === 0 && styles.emptyListContent,
      ]}
      columnWrapperStyle={data.length > 1 ? styles.productRow : undefined}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <View style={styles.productTop}>
            <View style={styles.productImageBox}>
              <Text style={styles.productEmoji}>{item.emoji}</Text>
            </View>

            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Text
                style={[
                  styles.heartIcon,
                  isFavorite(item.id) && styles.heartIconActive,
                ]}
              >
                ♥
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.productDescription}>
            {item.brand}{'\n'}
            {item.name}
          </Text>

          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>{item.status}</Text>
          </View>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => openCapture(item)}
          >
            <Text style={styles.captureButtonText}>Capturar Inventario</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );

  const renderProductos = () => (
    <View style={styles.screenContainer}>
      {renderHeader()}

      <Text style={styles.productsTitle}>Productos</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {renderProductGrid(filteredProducts, 'No se encontraron productos.')}

      {renderBottomNav()}
    </View>
  );

  const renderFavoritos = () => (
    <View style={styles.screenContainer}>
      {renderHeader()}

      <Text style={styles.productsTitle}>Favoritos</Text>

      {renderProductGrid(
        favoriteProducts,
        'Aún no has agregado productos a favoritos.'
      )}

      {renderBottomNav()}
    </View>
  );

  const renderCaptura = () => (
    <View style={styles.screenContainer}>
      {renderHeader()}

      <Text style={styles.captureTitle}>Captura de inventario</Text>

      <View style={styles.captureContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.captureImageFrame}>
            <Text style={styles.captureEmoji}>{selectedProduct?.emoji ?? '📦'}</Text>
          </View>

          <Text style={styles.captureLabel}>Esta el producto en tienda?</Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, inStore === 'SI' && styles.toggleButtonActive]}
              onPress={() => setInStore('SI')}
            >
              <Text style={styles.toggleText}>SI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, inStore === 'NO' && styles.toggleButtonActive]}
              onPress={() => setInStore('NO')}
            >
              <Text style={styles.toggleText}>NO</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.captureLabel}>Cual es el inventario físico?</Text>
          <TextInput
            style={styles.captureInput}
            value={physicalInventory}
            onChangeText={(text) => {
              setPhysicalInventory(text);
              if (captureError) setCaptureError('');
            }}
            keyboardType="numeric"
          />

          <Text style={styles.captureLabel}>Cual es el inventario sistema?</Text>
          <TextInput
            style={styles.captureInput}
            value={systemInventory}
            onChangeText={(text) => {
              setSystemInventory(text);
              if (captureError) setCaptureError('');
            }}
            keyboardType="numeric"
          />

          <Text style={styles.captureLabel}>Cual es el precio?</Text>
          <TextInput
            style={styles.captureInput}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (captureError) setCaptureError('');
            }}
            keyboardType="numeric"
          />

          {!!captureError && <Text style={styles.captureErrorText}>{captureError}</Text>}

          <View style={styles.captureActions}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
              <Text style={styles.actionButtonText}>Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setScreen('productos')}
            >
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {renderBottomNav()}
    </View>
  );

  const renderEstatus = () => (
    <View style={styles.screenContainer}>
      {renderHeader()}

      <Text style={styles.statusTitle}>Estatus de captura</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusIcon}>✉</Text>

        <View style={styles.statusMessageBox}>
          <Text style={styles.statusMessage}>
            Formulario enviado de manera exitosa.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backProductsButton}
          onPress={() => setScreen('productos')}
        >
          <Text style={styles.backProductsButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {renderBottomNav()}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {screen === 'login' && renderLogin()}
      {screen === 'registro' && renderRegister()}
      {screen === 'productos' && renderProductos()}
      {screen === 'favoritos' && renderFavoritos()}
      {screen === 'captura' && renderCaptura()}
      {screen === 'estatus' && renderEstatus()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  keyboard: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  techLogo: {
    width: 115,
    height: 32,
  },
  walmartLogo: {
    width: 110,
    height: 32,
  },
  title: {
    textAlign: 'center',
    fontSize: 29,
    fontWeight: '800',
    color: '#000',
    marginTop: 38,
    marginBottom: 28,
  },
  loginCard: {
    marginHorizontal: 22,
    backgroundColor: '#c40010',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 6,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  passwordWrapper: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000',
  },
  showButton: {
    minWidth: 62,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  showButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  forgotText: {
    color: '#f5c7c7',
    fontSize: 10,
    marginTop: -4,
    marginBottom: 12,
  },
  errorText: {
    color: '#ffe6e6',
    backgroundColor: '#8a0010',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 12,
  },
  successText: {
    color: '#fff',
    backgroundColor: '#0d8f1b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    marginBottom: 12,
  },
  helperText: {
    color: '#ffe6e6',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#fff',
    width: 118,
    height: 34,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#000',
    width: 110,
    height: 34,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#fff',
  },
  checkmark: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 14,
  },
  termsText: {
    color: '#fff',
    fontSize: 13,
  },
  pixelArea: {
    height: 110,
    position: 'relative',
    marginTop: 40,
  },
  pixel: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  bottomMosaic: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  mosaicSquare: {
    width: '10%',
  },
  productsTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginTop: 18,
    marginBottom: 12,
  },
  searchBox: {
    marginHorizontal: 16,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 24,
    color: '#000',
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  productsList: {
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: '48.5%',
    backgroundColor: '#d5d5d5',
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  productTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productImageBox: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productEmoji: {
    fontSize: 42,
  },
  heartIcon: {
    fontSize: 22,
    color: '#111',
    fontWeight: '700',
  },
  heartIconActive: {
    color: '#e40b1c',
  },
  productPrice: {
    fontWeight: '800',
    fontSize: 18,
    marginTop: 4,
  },
  productDescription: {
    fontSize: 12,
    minHeight: 48,
    marginTop: 4,
    color: '#111',
  },
  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0aaf21',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginVertical: 6,
  },
  stockText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  captureButton: {
    backgroundColor: '#e40b1c',
    borderRadius: 18,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: '#d5d5d5',
    marginHorizontal: 12,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  captureTitle: {
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 18,
  },
  captureContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  captureImageFrame: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    marginVertical: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureEmoji: {
    fontSize: 86,
    color: '#fff',
  },
  captureLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 6,
  },
  toggleButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 62,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    borderWidth: 2,
    borderColor: '#c40010',
  },
  toggleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
  },
  captureInput: {
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  captureErrorText: {
    color: '#fff',
    backgroundColor: '#8a0010',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    marginTop: 14,
  },
  captureActions: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#c40010',
    borderRadius: 20,
    width: 112,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#9b001f',
    borderRadius: 20,
    width: 112,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
  statusTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 18,
  },
  statusContainer: {
    flex: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#08b30f',
  },
  statusIcon: {
    fontSize: 120,
    color: '#fff',
    fontWeight: '700',
  },
  statusMessageBox: {
    marginTop: 34,
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
  },
  statusMessage: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  backProductsButton: {
    marginTop: 28,
    backgroundColor: '#fff',
    borderRadius: 18,
    minWidth: 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  backProductsButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomNav: {
    height: 60,
    backgroundColor: '#c40010',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
});