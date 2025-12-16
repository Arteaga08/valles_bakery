import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AdminUser from "./models/AdminUser.js";
import chalk from "chalk";
// 1. Cargar las variables de entorno
dotenv.config();

// 2. Conectar la base de datos
connectDB();

const createAdminUser = async () => {
  try {
    console.log(chalk.bold.red("--- Eliminando usuarios administradores existentes... ---"));
    await AdminUser.deleteMany(); // Limpia la colección AdminUser antes de empezar

    const adminData = {
      username: "admin",
      email: "admin@reposteria.com",
      password: "PasswordSeguro123",
    };

    const adminUser = await AdminUser.create(adminData);
    console.log(chalk.bold.green(`--- Usuario Administrador Creado: ${adminUser.email} ---`));

    process.exit();
  } catch (error) {
    // Si hay un error de conexión o de base de datos
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

// 3. Ejecutar la función de creación
createAdminUser();
