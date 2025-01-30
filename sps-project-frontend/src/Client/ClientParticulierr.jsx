import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import TablePagination from "@mui/material/TablePagination";
import "jspdf-autotable";
import { highlightText } from '../utils/textUtils';
import Search from "../Acceuil/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleIcon from "@mui/icons-material/People";
import jsPDF from 'jspdf';
import {
  faTrash,
  faFileExcel,
  faPlus,
  faMinus,
  faCircleInfo,
  faSquarePlus,
  faEdit,
  faList,
  faPrint,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "../style.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Checkbox, Fab, Toolbar } from "@mui/material";
import { useOpen } from "../Acceuil/OpenProvider"; 
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import Swal from "sweetalert2";

//------------------------- CLIENT LIST---------------------//
const ClientParticulierr = () => {
  const [clients, setClients] = useState([]);
  const [editSecteur, setEditSecteur] = useState({
    _method: "put",
    secteurClient: "",
    logoP: null
  });
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [regions, setRegions] = useState([]);
  const [agent, setAgent] = useState([]);
  const [modePaimant, setModePaimant] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const [secteurClient, setSecteurClient] = useState([]);

  const [siteClients, setSiteClients] = useState([]);
  const [newCategory, setNewCategory] = useState({ categorie: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalSite, setShowEditModalSite] = useState(false);
  const [showEditModalregions, setShowEditModalregions] = useState(false);
  const [showEditModalregionsSite, setShowEditModalregionsSite] = useState(false);

  const [showEditModalSecteur, setShowEditModalSecteur] = useState(false);
  const [showEditModalmod, setShowEditModalmod] = useState(false);


  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();

  const [regionFilter, setRegionFilter] = useState('');
const [zoneFilter, setZoneFilter] = useState('');
const [villeFilter, setVilleFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [errorsCR, setErrorsCR] = useState({
    nom: '',
    representant: '',
    date_debut: '',
    date_fin: ''
  });
  
  const [formData, setFormData] = useState({
    logoC: "",
    CodeClient: "",
    name: "",
    prenom: "",
    cin: "",
    civilite: "",
    nationalite: "",
    abreviation: "",
    categorie: "Direct",
    adresse: "",
    tele: "",
    logoC: null,
    ville: "",
    zone_id: "",
    region_id: "",
    secteur_id: "",
    agent_id:"",
    code_postal: "",
    mod_id:"",
    seince:"",
    montant_plafond:"",
  });
  const [errors, setErrors] = useState({
    logoC: "",
    CodeClient: "",
    name: "",
    prenom: "",
    cin: "",
    civilite: "",
    nationalite: "",
    abreviation: "",
    categorie: "",
    adresse: "",
    tele: "",
    ville: "",
    zone_id: "",
    region_id: "",
    code_postal: "",
    date_fin:""
  });
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0px",
  });
  //-------------------edit-----------------------//
  const [editingClient, setEditingClient] = useState(null); // State to hold the client being edited
  const [editingClientId, setEditingClientId] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false); // Gère l'affichage du formulaire
  const [showAddCategorySite, setShowAddCategorySite] = useState(false); // Gère l'affichage du formulaire

  const [showAddRegein, setShowAddRegein] = useState(false); // Gère l'affichage du formulaire
  const [showAddRegeinSite, setShowAddRegeinSite] = useState(false); // Gère l'affichage du formulaire

  const [showAddSecteur, setShowAddSecteur] = useState(false); // Gère l'affichage du formulaire

  const [showAddMod, setShowAddMod] = useState(false); // Gère l'affichage du formulaire

  //-------------------Pagination-----------------------/
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredclients, setFilteredclients] = useState([]);
  // Pagination calculations
  const indexOfLastClient = (page + 1) * rowsPerPage;
  const indexOfFirstClient = indexOfLastClient - rowsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  //-------------------Selected-----------------------/
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //-------------------Search-----------------------/
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  //------------------------Site-Client---------------------
  const [showFormSC, setShowFormSC] = useState(false);
  const [editingSiteClient, setEditingSiteClient] = useState(null);
  const [editingSiteClientId, setEditingSiteClientId] = useState(null);
  const [formDataSC, setFormDataSC] = useState({
    codeSiteClient: "",
    name: "",
    prenom: "",
    cin: "",
    civilite: "",
    nationalite: "",
    abreviation: "",
    adresse: "",
    tele: "",
    ville: "",
    categorie: "",
    zone_id: "",
    logoSC: "",
    code_postal: "",
    client_id: "",
    region_id: "",
    seince: "",
    mod_id:"",
    secteur_id:"",
    montant_plafond:"",
  });
  const [formContainerStyleSC, setFormContainerStyleSC] = useState({
    right: "-100%",
  });
  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRowsInfo, setExpandedRowsInfo] = useState([]);
  const [expandedRowsInfoSite, setExpandedRowsInfosite] = useState([]);


  const [filteredsiteclients, setFilteredsiteclients] = useState([]);
  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);


  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/all-data-client-particulier");
      const data = response.data;
      setClients(data.clients);
      setUsers(data.users);
      setZones(data.zones);
      setSecteurClient(data.secteurClients);
      setRegions(data.regions);
      setAgent(data.agent)
      setSiteClients(data.site_clients);
      setModePaimant(data.modpai)
      localStorage.setItem("clients", JSON.stringify(data.clients));
      localStorage.setItem("secteurs", JSON.stringify(data.secteurClients));
      localStorage.setItem("users", JSON.stringify(data.users));
      localStorage.setItem("zones", JSON.stringify(data.zones));
      localStorage.setItem("agent", JSON.stringify(data.agent));
      localStorage.setItem("regions", JSON.stringify(data.regions));
      localStorage.setItem("siteClients", JSON.stringify(data.site_clients || []));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des Clients.",
        });
      }
    }
  };
  
  
  useEffect(() => {
    const storedClients = localStorage.getItem("clients");
    const storedSecteurClients = localStorage.getItem("secteurs");
    const storedZones = localStorage.getItem("zones");
    const storedModes = localStorage.getItem("modes");
    const storedAgent = localStorage.getItem("agent");
    const storedRegions = localStorage.getItem("regions");
    const storedSiteClients = localStorage.getItem("siteClients");

    if (storedClients) setClients(JSON.parse(storedClients));
    if (storedSecteurClients) setSecteurClient(JSON.parse(storedSecteurClients));
    if (storedZones) setZones(JSON.parse(storedZones));
    if (storedModes) setModePaimant(JSON.parse(storedModes));
    if (storedRegions) setRegions(JSON.parse(storedRegions));
    if (storedAgent) setAgent(JSON.parse(storedAgent));
    if (storedSiteClients) setSiteClients(JSON.parse(storedSiteClients));
    if (!storedClients || !storedAgent || !storedModes || !storedZones || !storedRegions || !storedSiteClients) 
      fetchClients();
  }, []);


  const toggleRow = (clientId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(clientId)
        ? prevExpandedRows.filter((id) => id !== clientId)
        : [...prevExpandedRows, clientId]
    );
  };
  const toggleRowInfo = (clientId) => {
    setExpandedRowsInfo((prevExpandedRows) =>
      prevExpandedRows.includes(clientId)
        ? prevExpandedRows.filter((id) => id !== clientId)
        : [...prevExpandedRows, clientId]
    );
  };
  const toggleRowInfoSite = (clientId) => {
    setExpandedRowsInfosite((prevExpandedRows) =>
      prevExpandedRows.includes(clientId)
        ? prevExpandedRows.filter((id) => id !== clientId)
        : [...prevExpandedRows, clientId]
    );
  };
  
  //---------------------------------------------
  useEffect(() => {
    const filtered = clients.filter((client) =>
      Object.values(client).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );

    setFilteredclients(filtered);
  }, [clients, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChangeSC = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file" && files.length > 0) {
        setFormDataSC((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    } else {
        setFormDataSC((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
};

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file" && files.length > 0) {
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    } else {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
};

  // const handleChange = (e) => {
  //   setUser({
  //     ...user,
  //     [e.target.name]:
  //       e.target.type === "file" ? e.target.files[0] : e.target.value,
  //   });
  // };
  //------------------------- CLIENT EDIT---------------------//

  const handleEdit = (client) => {
    setErrors({})
    setEditingClient(client); 
    setFormData({
      CodeClient: client.CodeClient,
      name: client.name,
      prenom: client.prenom,
      cin: client.cin,
      civilite: client.civilite,
      nationalite: client.nationalite,
      abreviation: client.abreviation,
      adresse: client.adresse,
      categorie: client.categorie,
      tele: client.tele,
      ville: client.ville,
      zone_id: client.zone_id,
      region_id: client.region_id,
      code_postal: client.code_postal,
      secteur_id:client.secteur_id,
      agent_id:client.agent_id,
      id_agent:client.id_agent,
      date_debut:client.date_debut,
      date_fin:client.date_fin,
      mod_id:client.mod_id,
      seince:client.seince,
      montant_plafond:client.montant_plafond,

    });
    setSelectedProductsData(client.info_clients?.map(info => ({ ...info })));
    setSelectedProductsDataRep(client.represantant?.map(info => ({ ...info })));


    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeForm();
    }
  };
  useEffect(() => {
    if (editingClientId !== null) {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    }
  }, [editingClientId]);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {...errors};
  
    
    //   let arr = ["name", "prenom", "CodeClient", "tele", "adresse", "civilite", "nationalite", "tele"]
    //   arr.forEach((prop) => {
    //     if (formData[prop] === "") {
    //         isValid = false;
    //         setErrors({
    //           ...errors,
    //           [prop] : true
    //         })
    //         console.log("Error: " + prop + " is empty");
    //     }
    // });
    
    // if (selectedProductsDataRep.some(item => item.agent_id === '')) {
    //   newErrors.representant = 'Le représentant est obligatoire.';
    //   isValid = false;
    // }

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const url = editingClient
      ? `http://localhost:8000/api/clients_particulier/${editingClient.id}`
      : "http://localhost:8000/api/clients_particulier";
    
    let requestData;

    if (editingClient) {
      requestData ={
      _method: "put",
      CodeClient: formData.CodeClient,
      name: formData.name,
      prenom: formData.prenom,
      cin: formData.cin,
      logoC: formData.logoC,
      civilite: formData.civilite,
      nationalite: formData.nationalite,
      abreviation: formData.abreviation,
      categorie: formData.categorie,
      adresse: formData.adresse,
      tele: formData.tele,
      ville: formData.ville,
      zone_id: formData.zone_id,
      region_id: formData.region_id,
      agent_id: formData.agent_id,
      secteur_id: formData.secteur_id,
      code_postal: formData.code_postal,
      montant_plafond: formData.montant_plafond,
      seince: formData.seince,
      mod_id:formData.mod_id,
      // Enfants 
      enfantPrenom: selectedProductsData.prenom || "walo",
      enfantAge: selectedProductsData.age|| 1
      }

  }else {
      const formDatad = new FormData();
      formDatad.append("CodeClient", formData.CodeClient);
      formDatad.append("name", formData.name);
      formDatad.append("prenom", formData.prenom);
      formDatad.append("cin", formData.cin);
      formDatad.append("civilite", formData.name);
      formDatad.append("nationalite", formData.nationalite);
      formDatad.append("abreviation", formData.abreviation);
      formDatad.append("categorie", formData.categorie);
      formDatad.append("adresse", formData.adresse);
      formDatad.append("tele", formData.tele);
      formDatad.append("ville", formData.ville);
      formDatad.append("zone_id", formData.zone_id);
      formDatad.append("region_id", formData.region_id);
      formDatad.append("code_postal", formData.code_postal);
      if (formData.logoC)
        formDatad.append("logoC", formData.logoC);
      formDatad.append("secteur_id", formData.secteur_id || selectedCategory);
      formDatad.append("mod_id", formData.mod_id);
      formDatad.append("agent_id", formData.agent_id);
      formDatad.append("date_debut", formData.date_debut);
      formDatad.append("date_fin", formData.date_fin);
      formDatad.append("seince", formData.seince);
      formDatad.append("montant_plafond", formData.montant_plafond);
      // if (productData) {
      // formDatad.append("enfantPrenom", productData?.prenom);
      // formDatad.append("enfantAge", productData?.age);
      // }

      requestData = formDatad;
    }

    try {
      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      
      if (response.status === 200) {
        fetchClients();
        const successMessage = `Client ${
          editingClient ? "modifié" : "ajouté"
        } avec succès.`;
        Swal.fire({
          icon: "success",
          title: "Succès!",
          text: successMessage,
        });
        setSelectedProductsData([])
        setSelectedProductsDataRep([])
        setFormData({
          CodeClient: "",
          name: "",
          prenom: "",
          cin: "",
          civilite: "",
          nationalite: "",
          abreviation: "",
          adresse: "",
          tele: "",
          categorie: "Direct",
          ville: "",
          zone_id: "",
          region_id: "",
          code_postal: "",
          logoC: null,
          secteur_id:"",
          agent_id:"",
          id_agent:"",
          date_debut:"",
          date_fin:"",
          mod_id:"",
          seince:"",
          montant_plafond:"",
        });
        setErrors({
          CodeClient: "",
          name: "",
          prenom: "",
          cin: "",
          civilite: "",
          nationalite: "",
          abreviation: "",
          adresse: "",
          categorie: "",
          tele: "",
          ville: "",
          zone_id: "",
          region_id: "",
          code_postal: "",
        });
        setEditingClient(null);
        closeForm();
      }
    } catch (error) {
      setTimeout(() => {
        setErrors({
          CodeClient: error.response.data?.errors?.CodeClient,
          name: error.response.data?.errors?.name,
          prenom: error.response.data?.errors?.prenom,
          cin: error.response.data?.errors?.cin,
          civilite: error.response.data?.errors?.civilite,
          nationalite: error.response.data?.errors?.nationalite,
          abreviation: error.response.data?.errors?.abreviation,
          adresse: error.response.data?.errors?.adresse,
          tele: error.response.data?.errors?.tele,
          categorie: error.response.data?.errors?.categorie,
          ville: error.response.data?.errors?.ville,
          zone_id: error.response.data?.errors?.zone_id,
          region_id: error.response.data?.errors?.region_id,
          code_postal: error.response.data?.errors?.code_postal,
          logoC: error.response.data?.errors?.logoC,
          secteur_id: error.response.data?.errors?.secteur_id,
          agent_id: error.response.data?.errors?.agent_id,
          id_agent: error.response.data?.errors?.id_agent,
          date_debut: error.response.data?.errors?.date_debut,
          date_fin: error.response.data?.errors?.date_fin,
          mod_id: error.response.data?.errors?.mod_id,
          seince: error.response.data?.errors?.seince,
          montant_plafond: error.response.data?.errors?.montant_plafond,
        });
      }, 3000);
    }
  };

  //------------------------- CLIENT FORM---------------------//

  const handleShowFormButtonClick = () => {
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeForm();
    }
  };

  const closeForm = () => {
    setFormContainerStyle({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0" });
    setShowForm(false); // Hide the form
    setFormData({
      CodeClient: "",
      name: "",
      prenom: "",
      cin: "",
      civilite: "",
      nationalite: "",
      abreviation: "",
      adresse: "",
      logoC: null,
      tele: "",
      ville: "",
      zone_id: "",
      region_id: "",
      categorie: "Direct",
      user_id: "",
      code_postal: "",
      agent_id:"",
      secteur_id:"",
      id_agent:"",
      date_debut:"",
      date_fin:"",
      mod_id:"",
      seince:"",
      montant_plafond:"",

    });
    setErrors({
      CodeClient: "",
      name: "",
      prenom: "",
      cin: "",
      civilite: "",
      nationalite: "",
      abreviation: "",
      categorie: "",
      adresse: "",
      tele: "",
      ville: "",
      zone_id: "",
      region_id: "",
      code_postal: "",
    });
    setSelectedProductsData([])
    setSelectedProductsDataRep([])
    setEditingClient(null); // Clear editing client
  };
  //-------------------------SITE CLIENT----------------------------//
  //-------------------------  SUBMIT---------------------//
  const handleSelectItem = (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }

  };

  const getSelectedClientIds = () => {
    return selectedItems?.map((item) => item.id);
  };
  const handleEditSC = (siteClient) => {
    setErrors({})
    setEditingSiteClient(siteClient);
    setFormDataSC({
      codeSiteClient: siteClient.codeSiteClient,
      name: siteClient.name,
      prenom: siteClient.prenom,
      cin: siteClient.cin,
      civilite: siteClient.civilite,
      nationalite: siteClient.nationalite,
      abreviation: siteClient.abreviation,
      adresse: siteClient.adresse,
      tele: siteClient.tele,
      ville: siteClient.ville,
      zone_id: siteClient.zone_id,
      categorie: siteClient.categorie,
      region_id: siteClient.region_id,
      user_id: siteClient.user_id,
      code_postal: siteClient.code_postal,
      client_id: siteClient.client_id,
      mod_id:siteClient.mod_id,
      secteur_id:siteClient.secteur_id,
      montant_plafond:siteClient.montant_plafond,
      seince: siteClient.seince,
    });

        setSelectedProductsData(siteClient.info_site_clients?.map(info => ({ ...info })));
    setSelectedProductsDataRep(siteClient.represantant?.map(info => ({ ...info })));
    if (formContainerStyleSC.right === "-100%") {
      setFormContainerStyleSC({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeFormSC();
    }
  };
  const handleSubmitSC = async (e) => {
    e.preventDefault();
    const selectedClientIds = getSelectedClientIds();
    const url = editingSiteClient
      ? `http://localhost:8000/api/siteclients_particulier/${editingSiteClient.id}`
      : "http://localhost:8000/api/siteclients_particulier";

    let requestData;

    if (editingSiteClient) {
      requestData = {
        _method: "put",
        codeSiteClient: formDataSC.codeSiteClient,
        name: formDataSC.name,
        prenom: formDataSC.prenom,
        cin: formDataSC.cin,
        civilite: formDataSC.civilite,
        nationalite: formDataSC.nationalite,
        abreviation: formDataSC.abreviation,
        adresse: formDataSC.adresse,
        categorie: formDataSC.categorie,
        tele: formDataSC.tele,
        ville: formDataSC.ville,
        logoSC: formDataSC.logoSC,
        type: 'SC',
        zone_id: formDataSC.zone_id,
        categorie: formDataSC.categorie,
        region_id: formDataSC.region_id,
        code_postal: formDataSC.code_postal,
        client_id: formDataSC.client_id,
        secteur_id: formDataSC.secteur_id,
        mod_id: formDataSC.mod_id,
        seince: formDataSC.seince,
        montant_plafond: formDataSC.montant_plafond,
        //Enfant
        enfantPrenom: "temp",
        enfantAge: 1
      };
    
    } else {
      const formDataScd = new FormData();
      formDataScd.append("codeSiteClient", formDataSC.codeSiteClient);
      formDataScd.append("name", formDataSC.name);
      formDataScd.append("prenom", formDataSC.prenom);
      formDataScd.append("cin", formDataSC.cin);
      formDataScd.append("civilite", formDataSC.civilite);
      formDataScd.append("nationalite", formDataSC.nationalite);
      formDataScd.append("abreviation", formDataSC.abreviation);
      formDataScd.append("adresse", formDataSC.adresse);
      formDataScd.append("tele", formDataSC.tele);
      formDataScd.append("ville", formDataSC.ville);
      formDataScd.append("categorie", formDataSC.categorie);
      formDataScd.append("zone_id", formDataSC.zone_id);
      formDataScd.append("region_id", formDataSC.region_id);
      formDataScd.append("code_postal", formDataSC.code_postal);
      formDataScd.append("secteur_id", formDataSC.secteur_id);
      formDataScd.append("seince", formDataSC.seince);
      formDataScd.append("mod_id", formDataSC.mod_id);
      formDataScd.append("montant_plafond", formDataSC.montant_plafond);
      formDataScd.append("client_id", selectedClientIds.join(", "));
      if (formDataSC.logoSC) 
        formDataScd.append("logoSC", formDataSC.logoSC);
      formDataScd.append("enfantPrenom", "temp_add");
      formDataScd.append("enfantAge", 2);

      
      requestData = formDataScd;
    }

    try {
      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      // selectedProductsData.filter((info) => info.name = formData.name)

      const formDataRep = {
        represantants: selectedProductsDataRep.filter((info)=>info.id_agent && info.id_agent!=='')?.map(info => ({
          ...info,
          id_SiteClient: response.data.siteclient.id ,
          type: 'SC' 
        }))
      };
      if(selectedProductsDataRep.filter((info)=>info.id_agent && info.id_agent!=='')?.length >0){
        const responseRep = await axios({
        method: 'post',
        url: urlRep,
        data: formDataRep,
      });
      }
      if (response.status == 200) {
        fetchClients();
        const successMessage = `SiteClient ${
          editingSiteClient ? "modifié" : "ajouté"
        } avec succès.`;
        Swal.fire({
          icon: "success",
          title: "Succès!",
          text: successMessage,
        });
        closeFormSC();
        setFormDataSC({
          codeSiteClient: "",
          name: "",
          prenom: "",
          cin: "",
          civilite: "",
          nationalite: "",
          abreviation: "",
          adresse: "",
          tele: "",
          ville: "",
          zone_id: "",
          region_id: "",
          logoSC: null,
          code_postal: "",
          client_id: "",
          agent_id:"",
          id_agent:"",
          date_debut:"",
          date_fin:"",
          mod_id:"",
          seince:"",
          montant_plafond:"",
  });
      setEditingClient(null);
      }
    } catch (error) {
      setTimeout(() => {
        setErrors({
          codeSiteClient: error.response.data?.errors?.codeSiteClient,
          name: error.response.data?.errors?.name,
          prenom: error.response.data?.errors?.prenom,
          cin: error.response.data?.errors?.cin,
          civilite: error.response.data?.errors?.civilite,
          nationalite: error.response.data?.errors?.nationalite,
          abreviation: error.response.data?.errors?.abreviation,
          adresse: error.response.data?.errors?.adresse,
          tele: error.response.data?.errors?.tele,
          categorie: error.response.data?.errors?.categorie,
          ville: error.response.data?.errors?.ville,
          zone_id: error.response.data?.errors?.zone_id,
          region_id: error.response.data?.errors?.region_id,
          code_postal: error.response.data?.errors?.code_postal,
          logoC: error.response.data?.errors?.logoC,
          secteur_id: error.response.data?.errors?.secteur_id,
          agent_id: error.response.data?.errors?.agent_id,
          id_agent: error.response.data?.errors?.id_agent,
          client_id: error.response.data?.errors?.client_id,
          date_debut: error.response.data?.errors?.date_debut,
          date_fin: error.response.data?.errors?.date_fin,
          mod_id: error.response.data?.errors?.mod_id,
          seince: error.response.data?.errors?.seince,
          montant_plafond: error.response.data?.errors?.montant_plafond,
        });
      }, 3000);
    }
  };

  const handleDeleteSiteClient = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce site client ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/siteclients_particulier/${id}`)
          .then(() => {
            fetchClients();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Site Client supprimé avec succès.",
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 500) {
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Impossible de supprimer ce site  car il est utilise dans d'autre interfaces.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: error.response.data.message,
              });
            }
          });
      } else {
      }
    });
  };
  //------------------------- CLIENT FORM---------------------//

  const handleShowFormButtonClickSC = () => {
    if (!selectedItems) {
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: "Aucun client sélectionné pour ajouter un site client.",
      });
      return;
    }
    if (formContainerStyleSC.right === "-100%") {
      setFormContainerStyleSC({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeFormSC();
    }
  };

  const closeFormSC = () => {
    setFormContainerStyleSC({ right: "-100%" });
    setTableContainerStyle({ marginRight: "0" });
    setShowFormSC(false); // Hide the form
    setFormDataSC({
      codeSiteClient: "",
      name: "",
      prenom: "",
      cin: "",
      civilite: "",
      nationalite: "",
      abreviation: "",
      categorie: "",
      adresse: "",
      tele: "",
      ville: "",
      zone_id: "",
      region_id: "",
      user_id: "",
      code_postal: "",
      mod_id:"",
      secteur_id:"",
      seince:"",
      secteur_id:"",
      montant_plafond: "",
    });
    setSelectedItems([])
    setEditingSiteClient(null); // Clear editing client
  };

  //------------------------- CLIENT PAGINATION---------------------//

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem('rowsPerPageClients', selectedRows);  // Store in localStorage
    setPage(0);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem('rowsPerPageClients');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  //------------------------- CLIENT DELETE---------------------//

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce client ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/api/clients_particulier/${id.id}`)
          .then(() => {
            fetchClients();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Client supprimé avec succès.",
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response.data.message,
              });
            }
          });
      } else {
      }
    });
  };
  
  //-------------------------Select Delete --------------------//
  const handleDeleteSelected = () => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: "Non",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((id) => {
          axios
            .delete(`http://localhost:8000/api/clients_particulier/${id.id}`)
            .then(() => {
              fetchClients();
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Client supprimé avec succès.",
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: error.data.message,
              });
            });
        });
        
      }
    });

    setSelectedItems([]);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(clients?.map((client) => client.id));
    }
  };
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const exportToExcel = () => {
    const table = document.getElementById('clientsTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Clients' });
    XLSX.writeFile(workbook, 'clients_table.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Manually adding HTML content
    const title = 'Table  Clients';
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [['Logo', 'Code', 'Nom', 'Prenom', 'CIN', 'Civilite', 'Nationalite', 'Téléphone', 'Ville', 'Zone', 'Région']],
      body: filteredClients?.map(client => [
        client.logoC ? { content: 'Logo', rowSpan: 1 } : '',
        client.CodeClient || '',
        client.name || '',
        client.prenom || '',
        client.cin || '',
        client.civilite || '',
        client.nationalite || '',
        client.tele || '',
        client.ville || '',
        client.zone?.zone || '',
        client.region?.region || ''
      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
  
    doc.save('clients_table.pdf');
  };
  

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Client List</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Client List</h1>
          <table>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Code</th>
                <th>Nom</th>
                <th>Prenom</th>
                <th>CIN</th>
                <th>Civilite</th>
                <th>Nationalite</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Zone</th>
                <th>Région</th>
              </tr>
            </thead>
            <tbody>
              ${filteredClients?.map(client => `
                <tr>
                  <td><img src="${client.logoC ? `http://localhost:8000/storage/${client.logoC}` : "http://localhost:8000/storage/default_user.png"}" loading="lazy" alt="Logo" style="width:50px; height:50px; border-radius:50%;" /></td>
                  <td>${client.CodeClient || ''}</td>
                  <td>${client.name || ''}</td>
                  <td>${client.prenom || ''}</td>
                  <td>${client.cin || ''}</td>
                  <td>${client.civilite || ''}</td>
                  <td>${client.nationalite || ''}</td>
                  <td>${client.tele || ''}</td>
                  <td>${client.ville || ''}</td>
                  <td>${client.zone?.zone || ''}</td>
                  <td>${client.region?.region || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.print();
  };

  document.addEventListener("change", async function (event) {
    if (event.target && event.target.id.startsWith("actionDropdown_")) {
      const [action, zoneId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeleteZone(zoneId);
      } else if (action === "edit") {
        // Edit action
        handleEditZone(zoneId);
      }

      // Clear selection after action
      event.target.value = "";
    }
  });
  const handleDeleteRegion = async (RegionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/regions/${RegionId}`
      );
      Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Region supprimée avec succès.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: error.data.message,
      });
    }
  };

  const handleEditRegion = async (RegionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/regions/${RegionId}`
      );
      const regionToEdit = response.data;

      if (!regionToEdit) {
        
        return;
      }

      const { value: editedRegion } = await Swal.fire({
        title: "Modifier une region",
        html: `
          <form id="editZoneForm">
              <input id="swal-edit-input1" class="swal2-input" placeholder="Region" name="region" value="${regionToEdit.region
}">
          </form>
      `,
        showCancelButton: true,
        confirmButtonText: "Modifier",
        cancelButtonText: "Annuler",
        preConfirm: () => {
          const editedRegionValue =
            document.getElementById("swal-edit-input1").value;
          return { region: editedRegionValue };
        },
      });

      if (editedRegion && editedRegion.region !== regionToEdit.region) {
        const putResponse = await axios.put(
          `http://localhost:8000/api/regions/${RegionId}`,
          editedRegion
        );
        Swal.fire({
          icon: "success",
          title: "Succès!",
          text: "Region modifiée avec succès.",
        });
      } else {
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur!",
        text: error.data.message,
      });
    }
    fetchClients();
  };



  document.addEventListener("change", async function (event) {
    if (event.target && event.target.id.startsWith("actionDropdown_R")) {
      const [action, RegionId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeleteRegion(RegionId);
      } else if (action === "edit") {
        // Edit action
        handleEditRegion(RegionId);
      }

      // Clear selection after action
      event.target.value = "";
    }
  });
  //-----------------------------------------//

  const handleAddEmptyRow = () => {
    setSelectedProductsData([...selectedProductsData, {}]);
};
  const handleAddEmptyRowRep = () => {
    setSelectedProductsDataRep([...selectedProductsDataRep, {}]);
};
const handleDeleteProduct = (index, id) => {
  const updatedSelectedProductsData = [...selectedProductsData];
  updatedSelectedProductsData.splice(index, 1);
  setSelectedProductsData(updatedSelectedProductsData);
  if (id) {
      axios
          .delete(`http://localhost:8000/api/infoClient/${id}`)
          .then(() => {
            fetchClients();
          });
  }
};
const handleDeleteProductRap = (index, id) => {
  const updatedSelectedProductsData = [...selectedProductsDataRep];
  updatedSelectedProductsData.splice(index, 1);
  setSelectedProductsDataRep(updatedSelectedProductsData);
  if (id) {
      axios
          .delete(`http://localhost:8000/api/infoClient/${id}`)
          .then(() => {
            fetchClients();
          });
  }
};
const handleInputChange = (index, field, value) => {
  const updatedProducts = [...selectedProductsData];
  updatedProducts[index][field] = value;

  let newErrors = {...errors};
  if (field === 'name' && value === '') {
    newErrors.nom = 'Le nom est obligatoire.';
    updatedProducts[index]["name"] = formData.name;
  } else {
    newErrors.nom = '';
  }
  setSelectedProductsData(updatedProducts);

  setErrors(newErrors);
};
const handleInputChangeRep = (index, field, value) => {
  const updatedProducts = [...selectedProductsDataRep];
  updatedProducts[index][field] = value;
  let newErrors = {...errors};
  if (field === 'agent_id' && value === '') {
    newErrors.representant = 'Le représentant est obligatoire.';
  } else {
    newErrors.representant = '';
  }





  setErrors(newErrors);
  setSelectedProductsDataRep(updatedProducts);
};

const handleRegionFilterChange = (e) => {
  setRegionFilter(e.target.value);
};

const handleZoneFilterChange = (e) => {
  setZoneFilter(e.target.value);
};

const handleVilleFilterChange = (e) => {
  setVilleFilter(e.target.value);
};
const filteredClients = clients.filter((client) => {
  return (
    ((regionFilter ? client.region?.region === regionFilter : true) &&
    (zoneFilter ? client.zone?.zone === zoneFilter : true) &&
    (villeFilter ? client.ville === villeFilter : true) &&
    (selectedCategory ? client.secteur_id
      === selectedCategory : true)) &&
    (
      // (searchTerm ? client?.secteur?.secteurClient?.toLowerCase().startsWith(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.zone?.zone?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.region?.region?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.ville?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.categorie?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.civilite?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.nationalite?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.CodeClient?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.tele?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.abreviation?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.cin?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.CodeClient?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.seince?.toLowerCase().includes(searchTerm.toLowerCase()) : true) || 
      (searchTerm ? client?.cin?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.tele?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.code_postal?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? client?.montant_plafond?.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? modePaimant.find((agent)=>agent.id===client?.mod_id)?.mode_paimants.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
      (searchTerm ? secteurClient.find((agent)=>agent.id===client?.secteur_id)?.secteurClient?.toLowerCase().includes(searchTerm.toLowerCase()) : true) 
    )
  );
});


const handleAddZone = async () => {
  try {
    const formData = new FormData();
    formData.append("zone", newCategory.categorie);
    const response = await axios.post("http://localhost:8000/api/zones", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchClients(); // Refresh categories after adding
    setNewCategory({ categorie: "" })
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Zone ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddCategory(false);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleSave = async () => {
  try {
    await axios.put(`http://localhost:8000/api/zones/${categorieId}`, { zone:selectedCategoryId });
    await fetchClients(); // Refresh categories after adding
    setShowEditModal(false);
    setSelectedCategoryId([])
    // Fermer le modal
            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Zone modifiée avec succès.",
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleDeleteZone = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/zones/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Zone supprimée avec succès.",
    });
    await fetchClients(); // Refresh categories after adding

    // Récupérer les nouvelles catégories après suppression
   
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleEditZone = (categorieId) => {
  setSelectedCategoryId(categorieId);
  setCategorie(categorieId.id)
  setShowEditModal(true);
};
const handleAddRegine = async () => {
  try {
    const formData = new FormData();
    formData.append("region", newCategory.categorie);
    const response = await axios.post("http://localhost:8000/api/regions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchClients(); // Refresh categories after adding
    setNewCategory({ categorie: "" })

    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Regions ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddCategory(false);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleSaveRegine = async () => {
  try {
    await axios.put(`http://localhost:8000/api/regions/${categorieId}`, { region:selectedCategoryId });
    await fetchClients(); // Refresh categories after adding
    setShowEditModalregions(false);
    setSelectedCategoryId([])
    // Fermer le modal
            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Regions modifiée avec succès.",
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleDeleteRegine = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/regions/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Regions supprimée avec succès.",
    });
    await fetchClients(); // Refresh categories after adding

    // Récupérer les nouvelles catégories après suppression
   
  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleEditRegine = (categorieId) => {
  setSelectedCategoryId(categorieId.
    region
    );
  setCategorie(categorieId.id)
  setShowEditModalregions(true);
};

const handleAddSecteur = async () => {
  try {
    const formData = new FormData();
    formData.append("secteurClient", newCategory.categorie);
    if (newCategory.imageFile)
    formData.append("logoP", newCategory.imageFile);

    const response = await axios.post("http://localhost:8000/api/secteur_clients", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchClients(); // Refresh categories after adding
    setNewCategory({ categorie: "" })

    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Secteur d'activité ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddSecteur(false);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleSaveSecteur = async () => {
  try {
    const formData = new FormData();
    formData.append("_method", "put");
    formData.append("secteurClient", editSecteur.secteurClient);
    if (editSecteur.logoP)
    formData.append("logoP", editSecteur.logoP);
    await axios.post(`http://localhost:8000/api/secteur_clients/${categorieId}`, formData);
    fetchClients(); 
    setShowEditModalSecteur(false);
    // Fermer le modal
    setEditSecteur([])

            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Secteur d'activité modifiée avec succès.",
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleDeleteSecteur = async (categorieId) => {
  try {
     axios.delete(`http://localhost:8000/api/secteur_clients/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Secteur d'activité supprimée avec succès.",
    });
     fetchClients(); // Refresh categories after adding

    // Récupérer les nouvelles catégories après suppression
   
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleEditSecteur = (categorieId) => {
  setEditSecteur({...editSecteur, secteurClient: categorieId.secteurClient});
  setCategorie(categorieId.id)
  setShowEditModalSecteur(true);
};

const handleAddModP = async () => {
  try {
    const formData = new FormData();
    formData.append("mode_paimants", newCategory.categorie);
    const response = await axios.post("http://localhost:8000/api/mode-paimants", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchClients(); // Refresh categories after adding
    setNewCategory({ categorie: "" })

    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Mode paimants ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddMod(false);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleSaveModP = async () => {
  try {
    await axios.put(`http://localhost:8000/api/mode-paimants/${categorieId}`, { mode_paimants:selectedCategoryId });
     fetchClients(); // Refresh categories after adding
     setShowEditModalmod(false);
    // Fermer le modal
    setSelectedCategoryId([])

            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Mode paimants modifiée avec succès.",
      });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleDeleteModP = async (categorieId) => {
  try {
     axios.delete(`http://localhost:8000/api/mode-paimants/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Mode paimants supprimée avec succès.",
    });
     fetchClients(); // Refresh categories after adding

    // Récupérer les nouvelles catégories après suppression
   
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: error.data.message,
    });
  }
};
const handleEditModP = (categorieId) => {
  setSelectedCategoryId(categorieId.
    mode_paimants
    );
  setCategorie(categorieId.id)
  setShowEditModalmod(true);
};

const [activeIndex, setActiveIndex] = useState(0);
const [filtreclientBySect,setFiltreClientBySect] = useState([])
const handleSelect = (selectedIndex) => {
  setActiveIndex(selectedIndex);
};
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array?.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
const chunkSize = 9;
const chunks = chunkArray(secteurClient, chunkSize);


const handleCategoryFilterChange = (catId) => {
 
  setSelectedCategory(catId);
};
useEffect(() => {

},[])
  return (
    <ThemeProvider theme={createTheme()}>
      <Box sx={{...dynamicStyles}}>
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>

       
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "15px" }}
          >
            <h3 className="titreColore">
              {/* <PeopleIcon style={{ fontSize: "24px", marginRight: "8px" }} /> */}
              Liste des Clients Particulier
            </h3>
            <div className="d-flex">
              <div style={{ width: "500px", marginRight: "20px" }}>
                <Search onSearch={handleSearch} type="search" />
              </div>


              <div>
              <FontAwesomeIcon
    style={{
      cursor: "pointer",
      color: "grey",
      fontSize: "2rem",
    }}
    onClick={printTable}  
    icon={faPrint}
    className="me-2"
  />
                  <FontAwesomeIcon
      style={{
        cursor: "pointer",
        color: "red",
        fontSize: "2rem",
        marginLeft: "15px",
      }}
      onClick={exportToPDF}
            icon={faFilePdf}
    />

                <FontAwesomeIcon
                  icon={faFileExcel}
                  onClick={exportToExcel}
                  style={{
                    cursor: "pointer",
                    color: "green",
                    fontSize: "2rem",
                    marginLeft: "15px",
                  }}
                />
              </div>
            </div>
          </div>

          {
          
            <div style={{height:'125px',marginTop:'-15px'}}>
                                        <h5 className="container-d-flex justify-content-start AjouteBotton"style={{marginBottom:'-3px'}} >Secteur d'activité</h5>
                                        <div className=" bgSecteur" >

<Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null}
 nextIcon={<FaArrowRight size="2x" color="@ffffff" style={{backgroundColor:"black" ,borderRadius:'50%' ,marginTop:'-50px',marginRight:"5px",marginLeft:"-5px"}} />}
 prevIcon={<FaArrowLeft size="2x" color="@ffffff" style={{backgroundColor:"black" ,borderRadius:'50%',marginTop:'-50px',marginRight:"-5px",marginLeft:"5px"}} />}>

  {chunks?.map((chunk, chunkIndex) => (
    <Carousel.Item key={chunk.id}>
      <div className="d-flex justify-content-start">
        <a href="#" style={{marginLeft:'60px'}}>
          <div
            className={`category-item ${selectedCategory === '' ? 'active' : ''}`} 
            onClick={() => handleCategoryFilterChange("")}
          >
            <img
              src={'../../images/bayd.jpg'}
              alt={'tout'}
              loading="lazy"
              className={`rounded-circle category-img ${selectedCategory === '' ? 'selected' : ''}`}
            />
            <p className="category-text">Tout</p>
          </div>
        </a>

        {chunk?.map((category, index) => (
          <a href="#" className="mx-5" key={category.id}>
            <div
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`} 
              onClick={() => handleCategoryFilterChange(category.id)}
            >
              <img
                src={category.logoP ? `http://127.0.0.1:8000/storage/${category.logoP}` : "http://127.0.0.1:8000/storage/secteur-activite.webp"}
                alt={category.secteurClient}
                loading="lazy"
                decoding="async"
                className={`rounded-circle category-img ${selectedCategory === category.id ? 'selected' : ''}`}
              />
              <p className="category-text">{category.secteurClient}</p>
            </div>
          </a>
        ))}
      </div>
    </Carousel.Item>
  ))}
</Carousel>
</div>
</div>

          }

          <div className="container-d-flex justify-content-start">
            <div style={{ display: "flex", alignItems: "center" ,marginTop:'20px' ,padding:'0'}}>
             
              <a
                onClick={handleShowFormButtonClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                className="AjouteBotton"
              >
 <FontAwesomeIcon
                    icon={faPlus}
                    className=" AjouteBotton"
                    style={{ cursor: "pointer" }}
                  />                Ajouter Client
              </a>

            </div>

            <div className="filters" 
            >
            <Form.Select aria-label="Default select example"
             value={regionFilter} onChange={handleRegionFilterChange}
             style={{width:'10%',height:"35px",position:'absolute', left: '66%', top: '224px'}}>
            <option value="">Sélectionner Region</option>
    {
      regions?.map((region)=>(
        <option value={region.region}>{region.region}</option>
      ))
    }
    </Form.Select>

    <Form.Select aria-label="Default select example"
    value={zoneFilter} onChange={handleZoneFilterChange}
    style={{width:'10%' ,height:"35px",position:'absolute', left: '77%',  top: '224px'}}>
    <option value="">Sélectionner Zone</option>
    {
      zones?.map((zone)=>(
        <option value={zone.zone}>{zone.zone}</option>
      ))
    }
    </Form.Select>

    <Form.Select 
  aria-label="Default select example"
  value={villeFilter} 
  onChange={handleVilleFilterChange}
  style={{ width: '10%', height: "35px", position:'absolute', left: '88%',  top: '224px' }}
>
  <option value="">Sélectionner Ville</option>
  {
    [...new Set(clients?.map(zone => zone.ville))]
      ?.map((ville, index) => (
        <option key={index} value={ville}>{ville}</option>
      ))
  }
</Form.Select>



</div>

        <div style={{ marginTop:"0px",}}>
        <div id="formContainer" className="" style={{...formContainerStyle,marginTop:'0px',maxHeight:'700px',overflow:'auto',padding:'0'}}>
              <Form className="col row" onSubmit={handleSubmit}>
                <Form.Label className="text-center ">
                <h4
                     style={{
                      fontSize: "25px", 
                      fontFamily: "Arial, sans-serif", 
                      fontWeight: "bold", 
                      color: "black",
                      borderBottom: "2px solid black", 
                      paddingBottom: "5px",
                    }}
                    >
                      {editingClient ? "Modifier" : "Ajouter"} un Client</h4>
                </Form.Label>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer",marginTop:'-10px' }}
                    onClick={() => setShowAddCategory(true)} // Affiche le formulaire
                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Zone</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    name="zone_id"
                    isInvalid={!!errors.zone_id}
                    value={formData.zone_id}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner Zone</option>
                    {zones?.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zone}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.zone_id}
                    </Form.Text>
                </Form.Group>


                  <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Zone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la Zone"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Zone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {zones?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.zone}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditZone(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteZone(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddZone}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddCategory(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une Zone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de la Zone</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId.zone}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSave}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModal(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="ml-2 text-primary"
                    style={{ cursor: "pointer",marginTop:'-10px' }}
                    onClick={() => setShowAddRegein(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px'}}>Région</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    name="region_id"
                    isInvalid={!!errors.region_id}
                    value={formData.region_id}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner Region</option>
                    {regions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region
                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
                </Form.Group>
                <Modal show={showAddRegein} onHide={() => setShowAddRegein(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Region</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Region</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la region"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {regions?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.region}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditRegine(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteRegine(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddRegine}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddRegein(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalregions} onHide={() => setShowEditModalregions(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une 
Region
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de la Region</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveRegine}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalregions(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
    <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="ml-2 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddSecteur(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px',marginTop:'7px' }}>Secteur d'activité</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    isInvalid={!!errors.secteur_id}
                    name="secteur_id"
                    value={formData.secteur_id ? formData.secteur_id : selectedCategory}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner Secteur</option>
                    {secteurClient?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.secteurClient
                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
                </Form.Group>
                <Modal show={showAddSecteur} onHide={() => setShowAddSecteur(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Secteur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la Secteur"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Logo de Secteur</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Secteur</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {secteurClient?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.secteurClient}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditSecteur(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteSecteur(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddSecteur}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddSecteur(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalSecteur} onHide={() => setShowEditModalSecteur(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une 
        Secteur
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de la Secteur</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveSecteur}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalSecteur(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>

    <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="ml-2 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddMod(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px',marginTop:'7px' }}>Mode de paiement</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    isInvalid={!!errors.mod_id}
                    name="mod_id"
                    value={formData.mod_id}
                    onChange={handleChange}
                  >
                    <option value="">mode de paiement</option>
                    {modePaimant?.map((region) => (
                      <option key={region.id} value={region.id}>
      
      {region.mode_paimants
                        }
                      </option>
                      
                    ))}
                   
                  </Form.Select>
                </Form.Group>
                <Modal show={showAddMod} onHide={() => setShowAddMod(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une mode de paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>mode de paiement</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mode paimant"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>mode de paiement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {modePaimant?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.mode_paimants}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditModP(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteModP(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddMod(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalmod} onHide={() => setShowEditModalmod(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier 
        mode de paiement
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de mode de paiement</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalmod(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1', marginRight: '20px', marginLeft: '10px'}}>Logo</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="file"
                    name="logoC"
                    isInvalid={!!errors.logoC}
                    onChange={handleChange}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
                
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Code</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="CodeClient"
                    value={formData.CodeClient}
                    onChange={handleChange}
                    placeholder="Code"
                    className="form-control"
                    isInvalid={!!errors.CodeClient} // Validation pour Type de Quantité

                  />
                  
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Nom</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="form-control"
                    isInvalid={!!errors.name}
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Prenom</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prenom"
                    className="form-control"
                    isInvalid={!!errors.prenom} 
                  />
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>CIN</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="CIN"
                    className="form-control"
                    isInvalid={!!errors.cin} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Civilite</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="civilite"
                    value={formData.civilite}
                    onChange={handleChange}
                    placeholder="Civilite"
                    className="form-control"
                    isInvalid={!!errors.civilite} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Nationalite</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    placeholder="Nationalite"
                    className="form-control"
                    isInvalid={!!errors.nationalite} // Validation pour Type de Quantité
                  />
                </Form.Group>

                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Adresse</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Adresse"
                    className="form-control "
                    isInvalid={!!errors.adresse} // Validation pour Type de Quantité

                  />

                </Form.Group>
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
               
               <Form.Label className="col-sm-4" style={{ flex: '1', marginRight: '30px', marginLeft: '10px',marginTop:'7px' }}>Échéance</Form.Label>
               <Form.Select
               className="form-control "
               style={{ flex: '2' }}
                 as="select"
                 isInvalid={!!errors.seince}
                 name="seince"
                 value={formData.seince}
                 onChange={handleChange}
               >
                 <option value="">Sélectionner Échéance</option>
                 {[20,40,60,80]?.map((echeance) => (
                   <option key={echeance} value={echeance}>
                     {echeance
                     }
                   </option>
                 ))}
               </Form.Select>
               <Form.Text className="text-danger">
                   {errors.region_id}
                 </Form.Text>
             </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Abréviation</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="abreviation"
                    isInvalid={!!errors.abreviation}
                    value={formData.abreviation}
                    onChange={handleChange}
                    placeholder="abreviation"
                    className="form-control"
                  />
                  <Form.Text className="text-danger">
                    {errors.abreviation}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '35px', marginLeft: '10px'}}>Catégorie</Form.Label>
                  <Form.Select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    isInvalid={!!errors.categorie}
                    className="form-select form-select"
                  >
                    <option value="Direct">Direct</option>
                    <option value="Premium">Premium</option>
                    <option value="Revendeur">Revendeur</option>
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {errors.categorie}
                  </Form.Text>
                </Form.Group>

                
                <Form.Group className="col-sm-6 mt-4" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Téléphone</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="tel"
                    name="tele"
                    value={formData.tele}
                    isInvalid={!!errors.tele}
                    onChange={handleChange}
                    placeholder="06XXXXXXXX"
                    className="form-control"
                  />
                  <Form.Text className="text-danger">{errors.tele}</Form.Text>
                </Form.Group>
                <Form.Group className="col-sm-6 mt-4" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Ville</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    isInvalid={!!errors.ville}
                    placeholder="Ville"
                    className="form-control"
                  />
                  <Form.Text className="text-danger">{errors.ville}</Form.Text>
                </Form.Group>
              
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Code Postal</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="code_postal"
                    isInvalid={!!errors.code_postal}
                    value={formData.code_postal}
                    onChange={handleChange}
                    placeholder="code_postal"
                    className="form-control"
                  />
                  <Form.Text className="text-danger">
                    {errors.code_postal}
                  </Form.Text>
                </Form.Group>
                
<Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Montant Plafond</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="number"
                    name="montant_plafond"
                    isInvalid={!!errors.montant_plafond}
                    value={formData.montant_plafond}
                    onChange={handleChange}
                    placeholder="Montant Plafond"
                    className="form-control"
                  />
                </Form.Group>
            
                <div style={{ marginLeft: '10px' }}>
                  <a href="#" onClick={handleAddEmptyRow}>
                    <Button className="btn btn-sm mb-2" variant="primary" >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <span style={{ margin: "0 8px" }}></span>

      <strong style={{
        color:'black'
      } } >Ajouter Enfants</strong>
                  </a>
      
    </div>
    <Form.Group controlId="selectedProduitTable">
    <div className="table-responsive">
  <table className="table table-bordered" style={{ width: '100%', marginTop:'2px',padding:'0' }}>
    <thead>
      <tr >
        <th colSpan={5}>List Enfants</th>
      </tr>
      <tr>
        <th className="ColoretableForm">Nom</th>
        <th className="ColoretableForm">Prénom</th>
        <th className="ColoretableForm">Age</th>
        <th className="ColoretableForm">Action</th>
      </tr>
    </thead>
    <tbody>
      {selectedProductsData?.map((productData, index) => (
        <tr key={index.id}>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="text"
              disabled={true}
              value={formData.name || ""}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              placeholder="Nom"
            />
            <Form.Text className="text-danger">
  {errors.name}
</Form.Text>
          </td>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="text"
              value={productData?.prenom}
              onChange={(e) => handleInputChange(index, 'prenom', e.target.value)}
              placeholder="Prénom"
            />
          </td>
          <td style={{ backgroundColor: 'white',width: '20%' }}>
            <Form.Control
              type="number"
              min="0"
              value={productData?.age}
              onChange={(e) => handleInputChange(index, 'age', e.target.value)}
              placeholder="Age"
            />
          </td>
          <td style={{ backgroundColor: 'white', width: '10%' }}>
            <a href="#">
              <FontAwesomeIcon   color="red"            onClick={() => handleDeleteProduct(index, productData?.id)}
 icon={faTrash} />
            </a>
              
            
          </td>
        </tr>
      ))}
      {errors.products && (
        <tr>
          <td colSpan="5" className="text-danger text-center">
            {errors.products}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </Form.Group>
    <div style={{ marginLeft: '10px' }}>
                  <a href="#" onClick={handleAddEmptyRowRep}>
                    <Button className="btn btn-sm mb-2" variant="primary" >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <span style={{ margin: "0 8px" }}></span>

      <strong style={{
        color:'black'
      } } >Ajouter Représentant</strong>
                  </a>
      
    </div>
    <Form.Group controlId="selectedProduitTable">
    <div className="table-responsive" style={{padding:'0'}}>
  <table className="table table-bordered" style={{ width: '100%', marginTop:'2px',padding:'0' }}>
    <thead>
      <tr >
        <th colSpan={5}> Représentant</th>
      </tr>
      <tr>
        <th className="ColoretableForm">Représentant</th>
        <th className="ColoretableForm">date début</th>
        <th className="ColoretableForm">date fin</th>
        <th className="ColoretableForm">Action</th>

        
      </tr>
    </thead>
    <tbody>
    {selectedProductsDataRep?.map((productData, index) => (
        <tr key={index.id}>
                   <td style={{ backgroundColor: 'white', width: '20%' }}>
          <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                  
                    value={productData?.id_agent}
              onChange={(e) => handleInputChangeRep(index, 'id_agent', e.target.value)}
                  >
                    <option value="">Sélectionner Représentant</option>
                    {agent?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.NomAgent
                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
          </td>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="date"
              value={productData?.date_debut}
              onChange={(e) => handleInputChangeRep(index, 'date_debut', e.target.value)}
              placeholder="Date debut"
              isInvalid={!!errors.date_debut}
            />
          </td>
          <td style={{ backgroundColor: 'white',width: '20%' }}>
            <Form.Control
              type="date"
              value={productData?.date_fin}
              onChange={(e) => handleInputChangeRep(index, 'date_fin', e.target.value)}
              placeholder="Date fin"
              isInvalid={!!errors.date_fin}
            />
          </td>
          <td style={{ backgroundColor: 'white', width: '10%' }}>
            <a href="#">
              <FontAwesomeIcon   color="red"            onClick={() => handleDeleteProductRap(index, productData?.id)}
 icon={faTrash} />
            </a>
              
            
          </td>
        </tr>
      ))}
       
      {errors.products && (
        <tr>
          <td colSpan="5" className="text-danger text-center">
            {errors.products}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </Form.Group>
  <Form.Group className="mt-5 d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={closeForm}
  >
    Annuler
  </Fab>
      </Form.Group>
              </Form>
            </div>
        </div>
            <div
              id="formContainer"
              className=""
                style={{...formContainerStyleSC,marginTop:'0px',maxHeight:'700px',overflow:'auto'}}
            >
              <Form className="col row" onSubmit={handleSubmitSC}>
                <Form.Label className="text-center m-2">
                <h4
                     style={{
                      fontSize: "25px", 
                      fontFamily: "Arial, sans-serif", 
                      fontWeight: "bold", 
                      color: "black", 
                      borderBottom: "2px solid black",
                      paddingBottom: "5px",
                    }}
                    >
                    {editingSiteClient ? "Modifier" : "Ajouter"} Site Client
                  </h4>
                </Form.Label>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer" ,marginTop:'-10px'}}
                    onClick={() => setShowAddCategory(true)} // Affiche le formulaire
                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px'}}>Zone</Form.Label>
                  <Form.Control
                  style={{ flex: '2',marginLeft:'-15px' }}
                    as="select"
                    name="zone_id"
                    isInvalid={!!errors.zone_id}
                    value={formDataSC.zone_id}
                    onChange={handleChangeSC}
                  >
                    <option value="">Sélectionner Zone</option>
                    {zones?.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zone}
                      </option>
                    ))}
                    <Form.Text className="text-danger">
                      {errors.zone_id}
                    </Form.Text>
                  </Form.Control>
                </Form.Group>


                  <Modal show={showAddCategorySite} onHide={() => setShowAddCategorySite(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Zone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la Zone"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Zone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {zones?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.zone}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditZone(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteZone(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddZone}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddCategorySite(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalSite} onHide={() => setShowEditModalSite(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une Zone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de la Zone</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId.zone}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSave}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalSite(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer" ,marginTop:''}}
                    onClick={() => setShowAddRegein(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px'}}>Région</Form.Label>
                  <Form.Control
                  style={{ flex: '2' ,marginLeft:'-15px'}}
                    as="select"
                    name="region_id"
                    value={formDataSC.region_id}
                    isInvalid={!!errors.region_id}
                    onChange={handleChangeSC}
                  >
                    <option value="">Sélectionner Region</option>
                    {regions?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.region
                        }
                      </option>
                    ))}
                    <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
                  </Form.Control>
                </Form.Group>
                <Modal show={showAddRegeinSite} onHide={() => setShowAddRegeinSite(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Region</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Region</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la region"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Region</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {regions?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.region}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditRegine(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteRegine(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddRegine}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddRegeinSite(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalregionsSite} onHide={() => setShowEditModalregionsSite(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une 
Region
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de la Region</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveRegine}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalregionsSite(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
    <Modal show={showAddMod} onHide={() => setShowAddMod(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une mode de paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>mode de paiement</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mode paimant"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>mode de paiement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {modePaimant?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.mode_paimants}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditModP(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteModP(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddMod(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalmod} onHide={() => setShowEditModalmod(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier 
        mode de paiement
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de mode de paiement</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalmod(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
    <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="ml-2 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddSecteur(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px',marginTop:'7px' }}>Secteur d'activité</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    name="secteur_id"
                    value={formDataSC.secteur_id}
                    isInvalid={!!errors.secteur_id}
                    onChange={handleChangeSC}
                  >
                    <option value="">Sélectionner Secteur</option>
                    {secteurClient?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.secteurClient
                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
                </Form.Group>
                <Modal show={showAddSecteur} onHide={() => setShowAddSecteur(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Secteur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom de la Secteur"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Logo de Secteur</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewCategory({ ...newCategory, imageFile: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Photo</th>
                  <th>Secteur</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {secteurClient?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>  
                    <img
                        decoding="async"
                        src={categ.logoP ? `http://127.0.0.1:8000/storage/${categ.logoP}` : "http://127.0.0.1:8000/storage/secteur-activite.webp"}
                        alt={categ.logoP}
                        loading="lazy"
                        aria-hidden="true"
                        className={`rounded-circle category-img`}
                      />
                    </td>
                    <td>{categ.secteurClient}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditSecteur(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteSecteur(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddSecteur}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddSecteur(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalSecteur} onHide={() => setShowEditModalSecteur(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier une Secteur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom du Secteur</Form.Label>
            <Form.Control
              type="text"
              name="secteurClient"
              className="form-control"
              lang="fr"
              isInvalid={!!errors.secteurClient}
              value={editSecteur.secteurClient}
              onChange={(e) => setEditSecteur({...editSecteur, secteurClient: e.target.value})}
            />
          </Form.Group>
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!errors.logoP}
                    onChange={(e) => setEditSecteur({...editSecteur, logoP: e.target.files[0]})}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveSecteur}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalSecteur(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>

    <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="ml-2 text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddMod(true)} // Affiche le formulaire

                  />
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '20px',marginTop:'7px' }}>mode de paiement</Form.Label>
                  <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                    name="mod_id"
                    value={formDataSC.mod_id}
                    isInvalid={!!errors.mod_id}
                    onChange={handleChangeSC}
                  >
                    <option value="">mode de paiement</option>
                    {modePaimant?.map((region) => (
                      <option key={region.id} value={region.id}>
      
      {region.mode_paimants
                        }
                      </option>
                      
                    ))}
                   
                  </Form.Select>
                </Form.Group>
                <Modal show={showAddMod} onHide={() => setShowAddMod(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une 
          mode de paiement
</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>mode de paiement</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mode paimant"
                value={newCategory.categorie}
                onChange={(e) => setNewCategory({ ...newCategory, categorie: e.target.value })}
              />
            </Form.Group>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3"  style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>mode de paiement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {modePaimant?.map(categ => (
                  <tr key={categ.id}>
                    <td>{categ.id}</td>
                    <td>{categ.mode_paimants}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditModP(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteModP(categ.id)}
                                  icon={faTrash}
                                  style={{
                                    color: "#ff0000",
                                    cursor: "pointer",
                                  }}
                                />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        
          
          
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddMod(false)}
  >
    Annuler
  </Fab>
      </Form.Group>
        
      </Modal>
      <Modal show={showEditModalmod} onHide={() => setShowEditModalmod(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier 
        mode de paiement
</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nom de mode de paiement</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategoryId 
                
              }
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveModP}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalmod(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
    <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label style={{ flex: '1',marginRight: '5px', marginLeft: '10px'}}>Code</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="codeSiteClient"
                    value={formDataSC.codeSiteClient}
                    isInvalid={!!errors.codeSiteClient}
                    onChange={handleChangeSC}
                    placeholder="Code"
                    className="form-control"

                  />
                  
                </Form.Group>
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Nom</Form.Label>
                  <Form.Control
                    style={{ flex: '2' }}
                    type="text"
                    name="name"
                    value={formDataSC.name}
                    onChange={handleChangeSC}
                    placeholder="Nom"
                    className="form-control"
                    isInvalid={!!errors.name} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Prenom</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="prenom"
                    value={formDataSC.prenom}
                    onChange={handleChangeSC}
                    placeholder="Prenom"
                    className="form-control"
                    isInvalid={!!errors.prenom} // Validation pour Type de Quantité
                  />
                </Form.Group>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>CIN</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="cin"
                    value={formDataSC.cin}
                    onChange={handleChangeSC}
                    placeholder="CIN"
                    className="form-control"
                    isInvalid={!!errors.cin} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Civilite</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="civilite"
                    value={formDataSC.civilite}
                    onChange={handleChangeSC}
                    placeholder="Civilite"
                    className="form-control"
                    isInvalid={!!errors.civilite} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px'}}>Nationalite</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="text"
                    name="nationalite"
                    value={formDataSC.nationalite}
                    onChange={handleChangeSC}
                    placeholder="Nationalite"
                    className="form-control"
                    isInvalid={!!errors.nationalite} // Validation pour Type de Quantité
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }} >Adresse</Form.Label>
                  <Form.Control
                    style={{ flex: '2' }}
                    type="text"
                    name="adresse"
                    value={formDataSC.adresse}
                    onChange={handleChangeSC}
                    placeholder="Adresse"
                    className="form-control"
                    isInvalid={!!errors.adresse} // Validation pour Type de Quantité

                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
               
               <Form.Label className="col-sm-4" style={{ flex: '1', marginRight: '30px', marginLeft: '10px',marginTop:'7px' }}>Échéance</Form.Label>
               <Form.Select
               className="form-control "
               style={{ flex: '2' }}
                 as="select"
                 name="seince"
                 value={formDataSC.seince}
                 onChange={handleChangeSC}
                 isInvalid={!!errors.seince}
               >
                 <option value="">Sélectionner Échéance</option>
                 {[20,40,60,80]?.map((region) => (
                   <option key={region} value={region}>
                     {region

                     }
                   </option>
                 ))}
               </Form.Select>
               <Form.Text className="text-danger">
                   {errors.region_id}
                 </Form.Text>
             </Form.Group>
             <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '35px', marginLeft: '10px'}}>Catégorie</Form.Label>
                  <Form.Select
                    name="categorie"
                    value={formDataSC.categorie}
                    onChange={handleChangeSC}
                    isInvalid={!!errors.categorie}
                    className="form-select form-select"
                  >
                    <option value="Direct">Direct</option>
                    <option value="Premium">Premium</option>
                    <option value="Revendeur">Revendeur</option>
                  </Form.Select>
                  <Form.Text className="text-danger">
                    {errors.categorie}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Photo du Site Client</Form.Label>
                  <Form.Control
                    style={{ flex: '2' }}
                    type="file"
                    name="logoSC"
                    onChange={handleChangeSC}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Abréviation</Form.Label>
                  <Form.Control
                                    style={{ flex: '2' }}

                    type="text"
                    name="abreviation"
                    value={formDataSC.abreviation}
                    onChange={handleChangeSC}
                    isInvalid={!!errors.abreviation}
                    placeholder="Abréviation"
                    className="form-control"
                  />
                </Form.Group>
                
                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Téléphone</Form.Label>
                  <Form.Control
                                    style={{ flex: '2' }}

                    type="tel"
                    name="tele"
                    value={formDataSC.tele}
                    isInvalid={!!errors.tele}
                    onChange={handleChangeSC}
                    placeholder="06XXXXXXXX"
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-4" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Ville</Form.Label>
                  <Form.Control
                                    style={{ flex: '2' }}

                    type="text"
                    name="ville"
                    value={formDataSC.ville}
                    isInvalid={!!errors.ville}
                    onChange={handleChangeSC}
                    placeholder="Ville"
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group className="col-sm-6 mt-4" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                  <Form.Label style={{ flex: '1', marginRight: '5px', marginLeft: '10px' }}>Code Postal</Form.Label>
                  <Form.Control
                                    style={{ flex: '2' }}

                    type="text"
                    name="code_postal"
                    value={formDataSC.code_postal}
                    isInvalid={!!errors.code_postal}
                    onChange={handleChangeSC}
                    placeholder="code postal"
                    className="form-control"
                  />
                </Form.Group>

                <Form.Group className="col-sm-6 mt-3" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Montant plafond</Form.Label>
                  <Form.Control
                  style={{ flex: '2' }}
                    type="number"
                    name="montant_plafond"
                    value={formDataSC.montant_plafond}  
                    isInvalid={!!errors.montant_plafond}
                    onChange={handleChangeSC}
                    placeholder="Montant Plafond"
                    className="form-control"
                  />
                </Form.Group>

                

              
                {/* <Form.Group className="col-sm-4 m-2" controlId="user_id">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control
                                    style={{ flex: '2' }}

                    type="text"
                    name="user_id"
                    value={formDataSC.user_id}
                    onChange={handleChangeSC}
                    placeholder="user_id"
                    className="form-control-sm"
                  />
                </Form.Group> */}
                <div style={{ marginLeft: '10px' }}>
                  <a href="#" onClick={handleAddEmptyRow}>
                    <Button className="btn btn-sm mb-2" variant="primary" >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <span style={{ margin: "0 8px" }}></span>

      <strong style={{
        color:'black'
      } } >Ajouter Enfants</strong>
                  </a>
      
    </div>
    <Form.Group controlId="selectedProduitTable">
    <div className="table-responsive">
  <table className="table table-bordered" style={{ width: '100%', marginTop:'2px' }}>
    <thead>
      <tr >
        <th colSpan={5}> List Enfants</th>
      </tr>
      <tr>
        <th className="ColoretableForm">Nom</th>
        <th className="ColoretableForm">Prénom</th>
        <th className="ColoretableForm">Age</th>
        <th className="ColoretableForm">Action</th>
      </tr>
    </thead>
    <tbody>
      {selectedProductsData?.map((productData, index) => (
        <tr key={index.id}>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="text"
              value={formDataSC.name}
              isInvalid={!!errors.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
              placeholder="Nom"
            />
          </td>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="text"
              value={productData?.prenom}
              onChange={(e) => handleInputChange(index, 'prenom', e.target.value)}
              placeholder="Prénom"
            />
          </td>
          <td style={{ backgroundColor: 'white',width: '20%' }}>
            <Form.Control
              type="number"
              value={productData?.age}
              onChange={(e) => handleInputChange(index, 'age', e.target.value)}
              placeholder="Age"
            />
          </td>
          
          <td style={{ backgroundColor: 'white', width: '10%' }}>
            
              <FontAwesomeIcon   color="red"            onClick={() => handleDeleteProduct(index, productData?.id)}
 icon={faTrash} />
            
          </td>
        </tr>
      ))}
      {errors.products && (
        <tr>
          <td colSpan="5" className="text-danger text-center">
            {errors.products}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </Form.Group>
    <div style={{ marginLeft: '10px' }}>
                  <a href="#" onClick={handleAddEmptyRowRep}>
                    <Button className="btn btn-sm mb-2" variant="primary" >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <span style={{ margin: "0 8px" }}></span>

      <strong style={{
        color:'black'
      } } >Ajouter Représentant</strong>
                  </a>
      
    </div>
    <Form.Group controlId="selectedProduitTable">
    <div className="table-responsive">
  <table className="table table-bordered" style={{ width: '100%', marginTop:'2px',padding:'0' }}>
    <thead>
      <tr >
        <th colSpan={5}> Représentant</th>
      </tr>
      <tr>
        <th className="ColoretableForm">Représentant</th>
        <th className="ColoretableForm">date début</th>
        <th className="ColoretableForm">date fin</th>
        <th className="ColoretableForm">Action</th>

        
      </tr>
    </thead>
    <tbody>
    {selectedProductsDataRep?.map((productData, index) => (
        <tr key={index.id}>
                   <td style={{ backgroundColor: 'white', width: '20%' }}>
          <Form.Select
                  style={{ flex: '2' }}
                    as="select"
                  
                    value={productData?.id_agent}
              onChange={(e) => handleInputChangeRep(index, 'id_agent', e.target.value)}
                  >
                    <option value="">Sélectionner Représentant</option>
                    {agent?.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.NomAgent

                        }
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-danger">
                      {errors.region_id}
                    </Form.Text>
          </td>
          <td style={{ backgroundColor: 'white', width: '20%' }}>
            <Form.Control
              type="date"
             
              value={productData?.date_debut}
              onChange={(e) => handleInputChangeRep(index, 'date_debut', e.target.value)}
              placeholder="Date debut"
            />
          </td>
          <td style={{ backgroundColor: 'white',width: '20%' }}>
            <Form.Control
              type="date"
              
              value={productData?.date_fin}
              onChange={(e) => handleInputChangeRep(index, 'date_fin', e.target.value)}
              placeholder="Date fin"
              isInvalid={!!errors.date_fin} // Validation pour Type de Quantité

            />
          </td>
          <td style={{ backgroundColor: 'white', width: '10%' }}>
            <a href="#">
              <FontAwesomeIcon   color="red"            onClick={() => handleDeleteProductRap(index, productData?.id)}
 icon={faTrash} />
            </a>
              
            
          </td>
        </tr>
      ))}
       
      {errors.products && (
        <tr>
          <td colSpan="5" className="text-danger text-center">
            {errors.products}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </Form.Group>
                <Form.Group className="mt-5 d-flex justify-content-center">
                  
  <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={closeFormSC}
  >
    Annuler
  </Fab>
</Form.Group>

              </Form>
            </div>
            <div className="">
              <div
                id="tableContainer"
                className="table-responsive"
                style={{...tableContainerStyle, overflowX: 'auto', minWidth: '650px',
                  maxHeight: '700px', overflow: 'auto',
                  marginTop:'0px',
                }}
              >
                 <table className="table table-bordered" id="clientsTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead widthDetails">
            
      </th>
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Logo</th>
      <th className="tableHead">Code</th>
      <th className="tableHead">Nom</th>
      <th className="tableHead">Prenom</th>
      <th className="tableHead">CIN</th>
      <th className="tableHead">Civilite</th>
      <th className="tableHead">Nationalite</th>
      <th className="tableHead">Abréviation</th>
      <th className="tableHead">Adresse</th>
      <th className="tableHead">Téléphone</th>
      <th className="tableHead">Ville</th>
      <th className="tableHead">Code Postal</th>
      <th className="tableHead">Zone</th>
      <th className="tableHead">Région</th>
      <th className="tableHead">Catégorie</th>
      <th className="tableHead">Secteur d'activité</th>
      <th className="tableHead">représentant</th>
      <th className="tableHead">Séance</th>
      <th className="tableHead">Montant plafond</th>
      <th className="tableHead">Mode de paiement </th>

      <th className="tableHead "  >Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredClients
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((client) => {
        const rep =agent.find((agent)=>agent.id===client.last_represantant?.id_agent);
      return(
         <React.Fragment key={client.id}>
          <tr>
            <td style={{ backgroundColor: "white" }}>
              {
                client.site_clients?.length === 0 ? '':
                  <FontAwesomeIcon onClick={() => toggleRow(client.id)} icon={expandedRows.includes(client.id) ? faMinus : faPlus} />
              }
            </td>
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.some((item) => item.id === client.id)}
                onChange={() => handleSelectItem(client)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>
                <img
                  src={client.logoC ? `http://localhost:8000/storage/${client.logoC}` : "http://localhost:8000/storage/default_user.png"}
                  alt={client.logoC}
                  loading="lazy"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.CodeClient, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.name , searchTerm)  ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.prenom , searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.cin , searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.civilite , searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.nationalite , searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.abreviation, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.adresse, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.tele , searchTerm) ||''} <button onClick={() => toggleRowInfo(client.id)} style={{
              border:'none'
              ,backgroundColor:'white'
            }}>
              <FontAwesomeIcon icon={faList}
             /></button> </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.ville, searchTerm) ||''}</td>

            <td style={{ backgroundColor: "white" }}>{highlightText(client.code_postal, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client?.zone?.zone, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client?.region?.region, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.categorie, searchTerm) ||''}</td>
            <td>{highlightText(secteurClient.find((agent)=>agent.id===client?.secteur_id)?.secteurClient, searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(rep?.NomAgent , searchTerm)||''}</td>     
            <td style={{ backgroundColor: "white" }}>{highlightText(client.seince, searchTerm) ||''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(client.montant_plafond, searchTerm) ||''}</td>
            <td>{highlightText(modePaimant.find((agent)=>agent.id===client?.mod_id)?.mode_paimants, searchTerm) || ''}</td>
  <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(client)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(client.id)}
      icon={faTrash}
      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
    />
    <PeopleIcon
      style={{ color: "#007bff", cursor: "pointer" }}
      onClick={() => {
        handleSelectItem(client);
        handleShowFormButtonClickSC();
      }}
    />
  </div>
</td>

</tr>
          {expandedRows.includes(client.id) && client.site_clients?.map((siteClient) => (
  <React.Fragment key={siteClient.id}>
    <tr className="siteclient">
      <td colSpan={2}>Site</td>
      <td>
          <img
            src={siteClient.logoSC ? `http://localhost:8000/storage/${siteClient.logoSC}` : "http://localhost:8000/storage/default_user.png"}
            alt={siteClient.logoSC}
            loading="lazy"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
      </td>
      <td>{siteClient.codeSiteClient || ''}</td>
      <td>{siteClient.name ||''}</td>
      <td>{siteClient.prenom ||''}</td>
      <td>{siteClient.cin ||''}</td>
      <td>{siteClient.civilite ||''}</td>
      <td>{siteClient.nationalite ||''}</td>
      <td>{siteClient.abreviation || ''}</td>
      <td>{siteClient.adresse || ''}</td>
      <td>
        {siteClient.tele || ''} 
        <a href="#" color="black">
        <FontAwesomeIcon color="black" onClick={() => toggleRowInfoSite(siteClient.id)} icon={faList} />

        </a>
      </td>
      <td>{siteClient.ville || ''}</td>
      <td>{siteClient.code_postal || ''}</td>
      <td>{siteClient.zone?.zone || ''}</td>
      <td>{siteClient.region?.region|| ''}</td>
      <td>{siteClient.categorie|| ''}</td>
      
      <td>{secteurClient.find((agent)=>agent.id===siteClient.
secteur?.id)?.
secteurClient
|| ''}</td>
      <td>{agent.find((agent)=>agent.id===siteClient.
last_represantant?.id_agent
)?.
NomAgent|| ''}</td>

      <td >{siteClient.seince || ''}</td>
      <td >{siteClient.montant_plafond || ''}</td>

      <td>{modePaimant.find((agent)=>agent.id===siteClient?.
mod_id
)?.mode_paimants|| ''}</td>
      <td>
        <FontAwesomeIcon
          onClick={() => handleEditSC(siteClient)}
          icon={faEdit}
          style={{ color: "#007bff", cursor: "pointer" }}
        />
        <span style={{ margin: "0 8px" }}></span>
        <FontAwesomeIcon
          onClick={() => handleDeleteSiteClient(siteClient.id)}
          icon={faTrash}
          style={{ color: "#ff0000", cursor: "pointer" }}
        />
      </td>
    </tr>

    {/* Info Client Rendering */}
    {expandedRowsInfoSite.includes(siteClient.id) && siteClient.
info_site_clients
 && (
      <tr>
        <td colSpan="24"
         style={{
          padding: "0",
        }}
        >
            <table
              className="table table-responsive table-bordered"
              style={{ marginTop: '0px', marginBottom: '0px' }}
            >
              <thead>
                <tr>
                  <th className="ColoretableForm">Nom</th>
                  <th className="ColoretableForm">Prenom</th>
                  <th className="ColoretableForm">Age</th>
                </tr>
              </thead>
              <tbody>
                {siteClient.
info_site_clients?.map((info_clients) => (
                  <tr key={info_clients.id}>
                    <td>{info_clients.name}</td>
                    <td>{info_clients.prenom}</td>
                    <td>{info_clients.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </td>
      </tr>
    )}
  </React.Fragment>
))}

          {expandedRowsInfo.includes(client.id) && client.info_clients && (
                                            <tr>
                                                <td colSpan="25"
                                                 style={{
                                                  padding: "0",
                                                }}
                                                >
                                                    <div>
                                                        <table
                                                            className="table table-responsive table-bordered"
                                                            style={{marginTop:'0px',marginBottom:'0px'}}
                                                        >
                                                            <thead>
                                                            <tr>
                                                                <th   className="ColoretableForm">Nom</th>
                                                                <th   className="ColoretableForm">Prenom</th>
                                                                <th   className="ColoretableForm">Age</th>
                                                                {/* <th    style={{ backgroundColor: "#adb5bd" }}>Prix Vente</th>
                                                                <th    style={{ backgroundColor: "#adb5bd" }}>Total HT </th> */}
                                                                {/* <th className="text-center">Action</th> */}
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {client.info_clients?.map((info_clients) => {
                                                                    
                                                                    return (
                                                                        <tr key={info_clients.id}>
                                                                            <td>{info_clients.name}</td>
                                                                            <td>{info_clients.prenom}</td>
                                                                            <td>{info_clients.age}</td>
                                                                            {/* <td>{ligneDevis.prix_vente} DH</td>
                                                                            <td>
                                                                                {(
                                                                                    ligneDevis.quantite *
                                                                                    ligneDevis.prix_vente
                                                                                ).toFixed(2)}{" "}
                                                                                DH
                                                                            </td> */}
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
        </React.Fragment>
      )
       
})}
  </tbody>
</table>

                {/* )} */}
               
                <a href="#">
                  <Button
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems?.length === 0}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Supprimer selection
                </Button>
                </a>
                <TablePagination
                  rowsPerPageOptions={[5, 10,15,20, 25]}
                  component="div"
                  count={filteredclients?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ClientParticulierr;
