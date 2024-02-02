import { FcOk } from "react-icons/fc"; 
import { FcHighPriority } from "react-icons/fc"; 
import { FcApproval } from "react-icons/fc"; 

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserRegister() {

  const URL = import.meta.env.VITE_APP_API_URL
  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');
  const [verified, setVerified] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completeCredent, setCompletedCredent] = useState(false);
  const [pendingDocuments, setPendingDocuments] = useState<string[]>([]);
  const [pendingCredentials, setPendingCredentials] = useState<string[]>([]);

 useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || '');    
    handleSearch();
  }, [email]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: {
          email: email,
        },
      });      
      if (response.status === 200) {
        setFoundUserId(response.data._id);        
      } else if (response.status === 404) {
        setFoundUserId('');
        console.log('Usuario no encontrado');
      } else {
        console.error('Error al buscar usuario:');
      }
    } catch (error) {
      console.error('Error de red:');
    }
  };
  localStorage.setItem("id", foundUserId);  

  // const foundUserId = localStorage.getItem("id")


// **********************************************************

    const [formData, setFormData] = useState({
      nombre_apellidos: null,
      email: null,
      numero_identificacion: null,
      direccion: null,
      telefono: null,
      documento_identidad: null,
      estado_cuenta_bancario: null,
      declaraciones_impuestos: null,
      otros_documentos_financieros: null,
    });

    useEffect(() => {
      if (foundUserId) {
        axios.get(`${URL}/users/${foundUserId}`)
          .then(response => {
            const userData = response.data;  
            setFormData({
              nombre_apellidos: userData.nombre_apellidos || null,
              email: userData.email || null,
              numero_identificacion: userData.numero_identificacion || null,
              direccion: userData.direccion || null,
              telefono: userData.telefono || null,
              documento_identidad: userData.documento_identidad || null,
              estado_cuenta_bancario: userData.estado_cuenta_bancario || null,
              declaraciones_impuestos: userData.declaraciones_impuestos || null,
              otros_documentos_financieros: userData.otros_documentos_financieros || null,
            });

            const pendingDocs = Object.entries(userData)
            .filter(([key, value]) => value === null)
            .map(([key]) => key);
            setPendingDocuments(pendingDocs);
            
            const hasNullProperty = Object.values(userData).some(value => value === null);
            // console.log(hasNullProperty)
            setCompleted(!hasNullProperty)
            
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }
    }, [foundUserId]);

    // console.log(completed)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      console.log('Datos del formulario a enviar:', formData);
    
      try {
        const userId = localStorage.getItem('id');
        let apiUrl = `${URL}/users/`;
        let httpMethod = 'POST';
    
        if (userId) {
          // Si hay un ID en el localStorage, es una actualización (PUT)
          apiUrl += `${userId}`;
          httpMethod = 'PUT';
        }
    
        const response = await fetch(apiUrl, {
          method: httpMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Usuario agregado/actualizado con éxito:', data);
    
          // Guardar el ID en el localStorage si es un nuevo usuario
          if (!userId) {
            localStorage.setItem('id', data.id);
          }
        } else {
          console.error('Error al agregar/actualizar usuario:', response.statusText);
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    if (pendingDocuments.includes("username")) {
      setPendingDocuments(prevPendingDocs => prevPendingDocs.filter(item => item !== "username"));
      setPendingCredentials(prevPendingCreds => [...prevPendingCreds, "username"]);
    }
    
    if (pendingDocuments.includes("password")) {
      setPendingDocuments(prevPendingDocs => prevPendingDocs.filter(item => item !== "password"));
      setPendingCredentials(prevPendingCreds => [...prevPendingCreds, "password"]);
    }

    useEffect(() => {
      if (pendingDocuments.length > 0) {
        setCompleted(false);
      } else {
        setCompleted(true);
      }
    }, [pendingDocuments]);

    useEffect(() => {
      if (pendingCredentials.includes("username") && pendingCredentials.includes("password")) {
        setCompletedCredent(false);
      } else {
        setCompletedCredent(true);
      }
    }, [pendingCredentials]);

    localStorage.setItem("Completed", `${completeCredent}`);
    
    // console.log(pendingDocuments)
    // console.log(pendingCredentials)
    // console.log(completeCredent)

  return (
    <div className=" w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-white">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

          <Link to="/userReg">
            <h1 className="flex items-center justify-between px-3 py-2.5 font-bold bg-white text-black border rounded-full">
              User Register {completed ? <FcOk className="text-xl"/> : <FcHighPriority className="text-xl"/>}
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center justify-between px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              Credentials {completeCredent ? <FcOk className="text-xl"/> : <FcHighPriority className="text-xl"/>}
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">
          
          <div className="flex flex-row justify-between items-end">
            <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4">
              USER ACCOUNT
            </h2>

            <div className="flex justify-between w-[40%] mr-8">
              <h1 className="flex items-center">
                Pending  <FcHighPriority className="text-xl"/>     
              </h1>

              <h1 className="flex items-center">
                Completed  <FcOk className="text-xl"/>
              </h1>

              <h1 className="flex items-center">
                Verified  <FcApproval className="text-2xl"/>
              </h1>      
            </div>
          </div>
          

          <div className="flex flex-row justify-start items-center space-y-5 sm:flex-row sm:space-y-0 max-w-4xl my-8">
            {/* Imagen del perfil */}
            <img
              className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
              src={
                localStorage.getItem("profilePic") ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="Bordered avatar"
            />

            {/* Botones para cambiar y eliminar la imagen */}
            <div className="flex flex-col space-y-5 sm:ml-8">
              <button
                type="button"
                className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 "
              >
                Change Email Log in
              </button>
              <button
                type="button"
                className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
              >
                Change Password Log in
              </button>
            </div>

            <div className="flex flex-col justify-start items-center w-[47%] h-full">
              {completed ? (
                <div className="flex items-center">
                  <FcOk className="text-7xl" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FcHighPriority className="text-2xl" />
                  <h1 className="text-xl text-red-800 font-bold">Pending</h1>
                </div>
              )} 
                <div>
                  {pendingDocuments.map((document: string, index: number) => (
                    <div key={index} className="flex justify-center">
                      <h3>{document}</h3>
                    </div>
                  ))}
                </div>
            </div>

          </div>

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-4" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Full name
                </label>
                <input
                  onChange={handleInputChange}
                  name="nombre_apellidos"
                  type="text"
                  id="fullname"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Name"
                  value={formData.nombre_apellidos || ''}                
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Email
                </label>
                <input
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  id="email"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="your.email@mail.com"
                  value={formData.email || ''}                
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="Identification"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Identification Number
                </label>
                <input
                  onChange={handleInputChange}
                  name="numero_identificacion"
                  type="number"
                  id="Identification"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Identification"
                  value={formData.numero_identificacion || ''} 
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Residence Address
                </label>
                <input
                  onChange={handleInputChange}
                  name="direccion"
                  type="text"
                  id="Address"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Address"
                  value={formData.direccion || ''}
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  onChange={handleInputChange}
                  name="telefono"
                  type="number"
                  id="phone"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Phone"
                  value={formData.telefono || ''}
                  // required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileId"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your identity document
                </label>
                <input
                  onChange={handleInputChange}
                  name="documento_identidad"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileId"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"    
                  // required
                />
                <h1 className="text-green-600">{formData.documento_identidad}</h1>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileBank"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your bank account status
                </label>
                <input
                  onChange={handleInputChange}
                  name="estado_cuenta_bancario"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileBank"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                <h1 className="text-green-600">{formData.estado_cuenta_bancario}</h1>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileTax"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your tax return
                </label>
                <input
                  onChange={handleInputChange}
                  name="declaraciones_impuestos"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileTax"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                <h1 className="text-green-600">{formData.declaraciones_impuestos}</h1>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin1"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of other financial documents
                </label>
                <input
                  onChange={handleInputChange}
                  name="otros_documentos_financieros"
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="filefin1"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
                <h1 className="text-green-600">{formData.otros_documentos_financieros}</h1>
              </div>

              <div className="mb-2 sm:mb-6">
                <input
                  className="bg-inherit"                  
                  // required
                />
              </div>

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28"
                >
                  Save
                </button>
              </div> 
            </form>
          </div>
        </div>
      </main>

      <div className="md:hidden sticky flex flex-col gap-2 p-4 text-sm top-10 mb-8">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
        <Link to="/userReg">
          <h1 className="flex items-center px-3 py-2.5 font-bold bg-white text-black border rounded-full">
            User Register
          </h1>
        </Link>

        <Link to="/deviceReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Device Register
          </h1>
        </Link>

        <Link to="/CredentialsReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Credentials
          </h1>
        </Link>

        <Link to="/NotificacionesConfig">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Notifications
          </h1>
        </Link>

        <Link to="/account">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            PRO Account
          </h1>
        </Link>
      </div>
    </div>
  );
}

export { UserRegister };
