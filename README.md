# Dokumentacja

## a. Identyfikacja zagadnienia biznesowego
Projekt ma na celu stworzenie aplikacji do wypożyczania produktów, która ułatwia klientom szybki dostęp do oferty oraz zarządzanie wypożyczeniami online. Odbiorcami są użytkownicy poszukujący wygodnego sposobu na wypożyczenie sprzętu bez konieczności wizyty w sklepie fizycznym.

Aplikacja pozwala na przeglądanie produktów, rejestrację i logowanie użytkowników, składanie zamówień na wypożyczenie, wyświetlanie wypożyczonego sprzętu z możliwością zwrotu. Po zalogowaniu danymi: login:admin@gmail, hasło: admin, Administrator ma możliwośc sprawdzenia historii wszystkich wypożyczeń a także dodawania, usuwania i edytowania produktów. System zaspokaja potrzebę zdalnego i zautomatyzowanego procesu wypożyczania, co usprawnia obsługę klientów i zwiększa efektywność biznesu.

## b. Wymagania systemowe i funkcjonalne

### Wymagania systemowe

* Frontend: React 18+

* Backend: Node.js 18+

* Baza danych: SQLite 

* Autoryzacja: JSON Web Tokens (JWT)

### Wymagania funkcjonalne
* Rejestracja i logowanie: użytkownicy mogą się zarejestrować oraz zalogować do systemu, po czym ich dane (token i informacje o użytkowniku) są przechowywane i udostępniane w całej aplikacji poprzez AuthContext.

* Przeglądanie produktów: na stronie głównej i w dedykowanych widokach użytkownik może przeglądać listę produktów oraz szczegóły pojedynczego produktu.

* Wypożyczenia: użytkownik zalogowany może wypożyczyć określoną liczbę wybranego produktu na stronie produktu.

* Zarządzanie wypożyczeniami: na osobnej stronie /rent użytkownik może przeglądać swoje aktywne wypożyczenia, zwracać produkty częściowo lub w całości.

* Panel administracyjny: możliwość przeglądania historii wszystkich wypożyczeń, dodawania, edytowania i usuwania produktów.

## c. Analiza zagadnienia i jego modelowanie

### Diagram klas (obiektowy model):

* User — atrybuty: id, name, email, passwordHash.

* Product — atrybuty: id, name, description, price, stock, category, imageName.

* Rental — atrybuty: id, userId, dateRented, returnedAt.

* RentalItem — powiązanie Rental z Product, atrybuty: productId, quantity.
  
* Category - atrybuty: id, name, description

### Interakcje:

* Użytkownik przegląda produkty → wybiera produkt → wypożycza określoną ilość.

* Użytkownik może zwrócić wypożyczone produkty częściowo lub w całości.

* System aktualizuje stany magazynowe i historię wypożyczeń.

### Diagram ER (związków encji):

* User 1:N Rental

* Rental 1:N RentalItem

* Product 1:N RentalItem

* Category 1:N Product

### Przepływ danych:

* Użytkownik wysyła żądanie POST do /api/rentals.

* Backend weryfikuje dostępność i dokonuje aktualizacji stanów magazynowych.

* Zwroty realizowane przez PATCH na /api/rentals/{rentalId}/return.

## d. Implementacja

### Kluczowe fragmenty:
* Konfiguracja bazy danych (db.js)
  ```javascript
  const { Sequelize } = require('sequelize');
  
  const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false,
    });
    
    module.exports = sequelize;

* Definicja modelu Product z relacjami (models/Product.js)  
  Model Product odwzorowuje tabelę produktów z nazwą, opisem, ceną, stanem i nazwą pliku obrazka. Relacja belongsTo łączy produkt z jedną kategorią, a hasMany – kategorię z wieloma produktami.
  ```javascript
  const Product = sequelize.define('Product', {
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      imageName: DataTypes.STRING
    });

    Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });
    Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });

* Kontroler wypożyczeń (controllers/rentalController.js)  
  Metoda rent najpierw weryfikuje, czy wszystkie zamawiane produkty mają wystarczający stan. Następnie tworzy nagłówek wypożyczenia, pozycje w tabeli RentalItem i aktualizuje stan produktowy.
  ```javascript
  exports.rent = async (req, res, next) => {
      try {
        const { items } = req.body;
        const userId = req.user.id;
    
        for (const item of items) {
          const product = await Product.findByPk(item.productId);
          if (!product || product.stock < item.quantity) {
            return res.status(400).json({ error: `Brak produktu lub za mało sztuk: ${item.productId}` });
          }
        }
    
        const rental = await Rental.create({ userId });
        for (const item of items) {
          await RentalItem.create({
            rentalId: rental.id,
            productId: item.productId,
            quantity: item.quantity,
          });
    
          const product = await Product.findByPk(item.productId);
          await product.update({ stock: product.stock - item.quantity });
        }
      
        res.status(201).json({ message: 'Wypożyczono', rentalId: rental.id });
      } catch (err) {
        next(err);
      }
    };

* Middleware autoryzacji JWT (middleware/auth.js)  
Sprawdza obecność nagłówka Authorization, weryfikuje token JWT i dołącza obiekt użytkownika (req.user) do kolejnych funkcji. W razie błędu blokuje dostęp.
  ```javascript
  module.exports = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Brak tokenu' });
    
      const token = authHeader.split(' ')[1];
      try {
        const payload = jwt.verify(token, SECRET);
        req.user = payload;
        next();
      } catch (err) {
        return res.status(401).json({ error: 'Nieprawidłowy token' });
      }
    };
* Klient uwierzytelniania i kontekst (src/AuthContext.jsx)  
  Przechowuje stan uwierzytelnienia w React Context i localStorage. Funkcje login i logout aktualizują użytkownika i token. Dane są trwale zapisywane w przeglądarce.
  ```javascript
  export function AuthProvider({ children }) {
      const [user, setUser]   = useState(JSON.parse(localStorage.getItem('user')));
      const [token, setToken] = useState(localStorage.getItem('token'));
    
      useEffect(() => {
        user ? localStorage.setItem('user', JSON.stringify(user))
             : localStorage.removeItem('user');
      }, [user]);
    
      useEffect(() => {
        token ? localStorage.setItem('token', token)
              : localStorage.removeItem('token');
      }, [token]);
    
      const login = ({ user, token }) => { setUser(user); setToken(token); };
      const logout = () => { setUser(null); setToken(null); };
    
      return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
    }
* Fetchowanie i wypożyczanie na froncie (HomePage.jsx)  
  Wysyła żądanie POST do /api/rentals z tokenem w nagłówku. W przypadku sukcesu aktualizuje komunikat i odświeża listę produktów, aby odzwierciedlić nowy stan magazynu.
  ```javascript
  const handleRent = async (productId) => {
      try {
        const res = await fetch('/api/rentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: [{ productId, quantity: quantities[productId] }] }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        setMessages({ [productId]: `✅ ID: ${data.rentalId}` });
        fetchProducts();
      } catch (err) {
        setMessages({ [productId]: `❌ ${err.message}` });
      }
    };

## e. Uruchomienie
### Uruchomienie backendu
1. Przejdź do katalogu `backend`  
2. Zainstaluj zależności:  
   ```bash
   npm install
3. Uruchom serwer:  
   ```bash
   npm start
Serwer będzie dostępny pod adresem http://localhost:3000

### Uruchomienie frontendu
1. Przejdź do katalogu `frontend`  
2. Zainstaluj zależności:  
   ```bash
   npm install
3. Uruchom frontend:  
   ```bash
   npm run dev
Aplikacja wystartuje pod adresem http://localhost:5173

## f. Podsumowanie
Projekt zrealizował główny cel: stworzenie aplikacji frontendowej umożliwiającej przeglądanie produktów, wypożyczanie oraz zwroty z autoryzacją użytkownika.
W przyszłości można by  rozszerzyć aplikację  o powiadomienia push oraz integrację z płatnościami online, co pozwoli na pełniejsze wykorzystanie potencjału biznesowego systemu.


  
