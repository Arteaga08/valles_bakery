import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    // Rol simple para el único administrador
    role: {
      type: String,
      default: "Admin",
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// Método para comparar la contraseña ingresada con la hasheada en la BD
AdminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware para hashear la contraseña antes de guardar (si se modifica)
AdminUserSchema.pre("save", async function (next) {
  // Solo hashea si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);

export default AdminUser;
