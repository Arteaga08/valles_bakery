import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="block lg:flex min-h-screen bg-[#FAF7F2] w-full">
      <AdminSidebar />

      <main
        className="
          flex-1
          w-full
          lg:ml-72 
          pt-28 lg:pt-20
          px-4 md:px-10
          pb-20
        "
      >
        {/* Contenedor de seguridad para que nada se salga en pantallas pequeñas */}
        <div className="w-full max-w-full overflow-hidden">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
