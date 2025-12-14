import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promisify database methods
// db.run needs special handling to return lastID
const originalRun = db.run.bind(db);
db.run = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    originalRun(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};
db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));

// Initialize database tables
export const initDatabase = async () => {
  try {
    // Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Menu items table
    await db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tables table
    await db.run(`
      CREATE TABLE IF NOT EXISTS tables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        capacity INTEGER DEFAULT 4,
        status TEXT DEFAULT 'available',
        qr_code_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        table_id INTEGER,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        table_number TEXT,
        number_of_guests INTEGER,
        items TEXT NOT NULL,
        total_price REAL NOT NULL,
        status TEXT DEFAULT 'completed',
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (table_id) REFERENCES tables(id)
      )
    `);

    // Create default admin user if not exists
    const bcrypt = (await import('bcryptjs')).default;
    const adminExists = await db.get('SELECT * FROM users WHERE email = ?', ['admin@foodorder.com']);
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@foodorder.com', hashedPassword, 'admin']
      );
      console.log('Default admin user created: admin@foodorder.com / admin123');
    }

    // Create default tables if not exists
    const tablesCount = await db.get('SELECT COUNT(*) as count FROM tables');
    if (tablesCount.count === 0) {
      for (let i = 1; i <= 5; i++) {
        await db.run(
          'INSERT INTO tables (name, capacity, status) VALUES (?, ?, ?)',
          [`Bàn ${i}`, 4, 'available']
        );
      }
      console.log('Default tables created');
    }

    // Seed default menu items if not exists
    const menuCount = await db.get('SELECT COUNT(*) as count FROM menu_items');
    if (menuCount.count === 0) {
      const defaultMenuItems = [
        { name: "Phở Bò Tái", description: "Phở bò truyền thống với thịt bò tái tươi ngon", price: 75000, category: "main", image: "/images/pho_bo.jpg" },
        { name: "Cơm Tấm Sài Gòn", description: "Cơm tấm với sườn nướng, chả trứng và đồ chua", price: 60000, category: "main", image: "/images/com_tam.jpg" },
        { name: "Bún Mọc", description: "Bún mọc thơm ngon với thịt viên và nước dùng đậm đà", price: 50000, category: "main", image: "/images/bunmoc.jpg" },
        { name: "Bún Chả", description: "Bún chả Hà Nội với thịt nướng thơm lừng", price: 60000, category: "main", image: "/images/buncha.jpg" },
        { name: "Gỏi Cuốn Tôm Thịt", description: "Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún", price: 45000, category: "appetizer", image: "/images/goi_cuon.jpg" },
        { name: "Cháo Lòng", description: "Cháo lòng nóng hổi với lòng heo tươi ngon", price: 40000, category: "main", image: "/images/chaolong.jpg" },
        { name: "Cá Nướng Muối Ớt", description: "Cá nướng muối ớt cay nồng thơm ngon", price: 95000, category: "grilled", image: "/images/ca_nuong.jpg" },
        { name: "Sườn Nướng", description: "Sườn heo nướng thơm lừng với sốt đặc biệt", price: 85000, category: "grilled", image: "/images/suon_nuong.jpg" },
        { name: "Chè Bưởi", description: "Chè bưởi mát lạnh, thanh mát", price: 25000, category: "dessert", image: "/images/che_buoi.jpg" },
        { name: "Nhãn Trần", description: "Nhãn trần tươi ngon, ngọt thanh", price: 20000, category: "dessert", image: "/images/nhan_tran.jpg" },
        { name: "Hoa Quả", description: "Đĩa hoa quả tươi ngon, đa dạng", price: 35000, category: "dessert", image: "/images/hoa_qua.jpg" },
        { name: "Sữa Đậu Nành", description: "Sữa đậu nành thơm ngon, bổ dưỡng", price: 12000, category: "drink", image: "/images/sua_dau_nanh.jpg" },
        { name: "Bánh Flan", description: "Bánh flan caramel mềm mịn, ngọt ngào", price: 30000, category: "dessert", image: "/images/flan.jpg" },
        { name: "Cà Phê", description: "Cà phê đậm đà, thơm ngon", price: 15000, category: "drink", image: "/images/cafe.jpg" },
        { name: "Trà Đá", description: "Trà đá mát lạnh giải nhiệt", price: 10000, category: "drink", image: "/images/tra_da.jpg" }
      ];
      
      for (const item of defaultMenuItems) {
        await db.run(
          'INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.category, item.image]
        );
      }
      console.log(`✅ ${defaultMenuItems.length} default menu items created`);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default db;

