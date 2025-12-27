import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />

      {/* CONTENIDO */}
      <main
        className="
        pt-16 lg:pt-0
        lg:ml-72
        px-6 py-8
      "
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
