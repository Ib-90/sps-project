import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import Navigation from "../Acceuil/Navigation";
import { highlightText } from '../utils/textUtils';
import { sanitizeInput } from "../utils/sanitizeInput";
import TablePagination from "@mui/material/TablePagination";
// import PrintList from "./PrintList";
// import ExportPdfButton from "./exportToPdf";
import "jspdf-autotable";
import Search from "../Acceuil/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PeopleIcon from "@mui/icons-material/People";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import { useOpen } from "../Acceuil/OpenProvider"; // Importer le hook personnalisé
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import TarifChambre from "./TarifChambre";

//------------------------- Tarifs Reduction ---------------------//
const TarifReduction = () => {
  const [tarifReduction, setTarifReduction] = useState([]);
  const [typesReduction, setTypesReduction] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tarifReductionErrors, setTarifReductionErrors] = useState({
    designation: "",
    photo: null
  })
  const [tarifsReduction, setTarifsReduction] = useState([]);
  const [editingTypeReduction, setEditingTypeReduction] = useState({
    code: "",
    type_reduction: ""
  });
  const [editingDesignation, setEditingDesignation] = useState({});
  const [typeErrors, setTypeErrors] = useState({
    code: "",
    type_reduction: "",
  })

  //---------------form-------------------//
  const [newReduction, setNewReduction] = useState({
    type_reduction: "",
    designation: "",
    montant: "",
    percentage: ""
  });
  const [newDesignation, setNewDesignation] = useState({
    designation: "",
    photo: ""
  });
  const [newCategory, setNewCategory] = useState({ categorie: ""})
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalSite, setShowEditModalSite] = useState(false);
  const [showEditModalDesignation, setShowEditModalDesignation] = useState(false);

  const [showEditModalSecteur, setShowEditModalSecteur] = useState(false);
  const [showEditModalmod, setShowEditModalmod] = useState(false);
  const [showAddDesignation, setShowAddDesignation] = useState(false); 


  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [categorieId, setCategorie] = useState();

const [typeReduction, setTypeReduction] = useState('');
const [newTypeReduction, setNewTypeReduction] = useState({
  code: "",
  type_reduction: "",
});

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type_reduction: "", 	
    designation: "",
    percentage: "",
    montat: "",
  });
  const [errors, setErrors] = useState({
    type_reduction: "",
    designation: "",
    montant: "",
    percentage: ""
  });
  const [formContainerStyle, setFormContainerStyle] = useState({
    right: "-100%",
  });
  const [tableContainerStyle, setTableContainerStyle] = useState({
    marginRight: "0px",
  });
  //-------------------edit-----------------------//
  const [editingTarifReduction, setEditingTarifReduction] = useState(null); // State to hold the client being edited
  const [editingTarifReductionId, setEditingTarifReductionId] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false); 
  const [showAddReduction, setShowAddReduction] = useState(false); 
  const [showAddCategorySite, setShowAddCategorySite] = useState(false); // Gère l'affichage du formulaire

  const [showAddRegein, setShowAddRegein] = useState(false); // Gère l'affichage du formulaire
  const [showAddRegeinSite, setShowAddRegeinSite] = useState(false); // Gère l'affichage du formulaire

  const [showAddSecteur, setShowAddSecteur] = useState(false); // Gère l'affichage du formulaire

  const [showAddMod, setShowAddMod] = useState(false); // Gère l'affichage du formulaire

  //-------------------Pagination-----------------------/
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [filteredTarifReduction, setFilteredTarifReduction] = useState([]);
  // Pagination calculations
  const indexOfLastTarif = (page + 1) * rowsPerPage;
  const indexOfFirstTarif = indexOfLastTarif - rowsPerPage;
  const currentReduction = tarifReduction?.slice(indexOfFirstTarif, indexOfLastTarif);
  //-------------------Selected-----------------------/
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  //-------------------Search-----------------------/
  const [searchTerm, setSearchTerm] = useState("");
  //------------------------Site-Client---------------------

  const [expandedRows, setExpandedRows] = useState([]);
  const [expandedRowsContact, setExpandedRowsContact] = useState([]);
  const [expandedRowsContactSite, setExpandedRowsContactsite] = useState([]);


  const { open } = useOpen();
  const { dynamicStyles } = useOpen();
  const [selectedProductsData, setSelectedProductsData] = useState([]);
  const [selectedProductsDataRep, setSelectedProductsDataRep] = useState([]);


  const fetchTarifReduction = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/tarifs-reduction");
      const data = response.data;
  
      setTarifReduction(data.tarifsReductionDetail);
      setTarifsReduction(data.tarifsReduction);
      setTypesReduction(data.typesReduction);

      localStorage.setItem("typesReduction", JSON.stringify(data.typesReduction));
      localStorage.setItem("tarifReduction", JSON.stringify(data.tarifsReductionDetail));
      localStorage.setItem("tarifsReduction", JSON.stringify(data.tarifsReduction));
      
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Accès refusé",
          text: "Vous n'avez pas l'autorisation de voir la liste des Tarifs Reduction.",
        });
      }
    }
  };
  
  useEffect(() => {
    const storedTypesReduction = localStorage.getItem("typesReduction");
    const storedTarifReductionDetail = localStorage.getItem("tarifReduction");
    const storedTarifsReduction = localStorage.getItem("tarifsReduction");
    storedTarifReductionDetail && setTarifReduction(JSON.parse(storedTarifReductionDetail));
    storedTarifsReduction && setTarifsReduction(JSON.parse(storedTarifsReduction));
    storedTypesReduction && setTypesReduction(JSON.parse(storedTypesReduction));

    if (!storedTarifReductionDetail || !storedTarifsReduction || !storedTypesReduction)
      fetchTarifReduction();
    
  }, []);


  const toggleRow = (tarifReductionId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(tarifReductionId)
        ? prevExpandedRows?.filter((id) => id !== tarifReductionId)
        : [...prevExpandedRows, tarifReductionId]
    );
  };
  const toggleRowContact = (tarifReductionId) => {
    setExpandedRowsContact((prevExpandedRows) =>
      prevExpandedRows.includes(tarifReductionId)
        ? prevExpandedRows?.filter((id) => id !== tarifReductionId)
        : [...prevExpandedRows, tarifReductionId]
    );
  };
  const toggleRowContactSite = (TarifReductionId) => {
    setExpandedRowsContactsite((prevExpandedRows) =>
      prevExpandedRows.includes(TarifReductionId)
        ? prevExpandedRows?.filter((id) => id !== TarifReductionId)
        : [...prevExpandedRows, TarifReductionId]
    );
  };
  //---------------------------------------------
  useEffect(() => {
    const filtered = tarifReduction?.filter((tarifReduction) =>
      Object.values(tarifReduction).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
    setFilteredTarifReduction(JSON.stringify(tarifReduction));
  }, [tarifReduction, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });
  };

  // const handleChange = (e) => {
  //   setUser({
  //     ...user,
  //     [e.target.name]:
  //       e.target.type === "file" ? e.target.files[0] : e.target.value,
  //   });
  // };
  //------------------------- tarif Reduction EDIT---------------------//

  const handleEdit = (tarifReduction) => {
    setEditingTarifReduction(tarifReduction); 

    // Populate form data with tarif Reduction details
    setFormData({
        designation: tarifReduction.tarif_reduction?.id,
        type_reduction: tarifReduction.type_reduction?.id,
        montant: tarifReduction.montant,
        percentage: tarifReduction.percentage,
  });
    if (formContainerStyle.right === "-100%") {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    } else {
      closeForm();
    }
  };
  useEffect(() => {
    if (editingTarifReductionId !== null) {
      setFormContainerStyle({ right: "0" });
      setTableContainerStyle({ marginRight: "650px" });
    }
  }, [editingTarifReductionId]);

  useEffect(() => {
    const validateData = () => {
      const newErrors = { ...errors };
      const newTarifReductionErrors = { ...tarifReductionErrors };
      const newTypeErrors = {...typeErrors}
      newErrors.designation = (selectedCategory || formData.designation) === "";
      newErrors.type_reduction = formData.type_reduction === "";
      newErrors.percentage = formData.percentage === "";
      newErrors.montant = (formData.montant < 5 || formData.montant == null) ? true : false;
      // Validation L'insertion de Type Chambre
      const typesCodes = typesReduction.filter((chambre) => chambre.code);
      if (!newTypeReduction) 
      newTypeErrors.code = newTypeReduction.code === "" || typesCodes.some((chambre) => sanitizeInput(chambre.code) === sanitizeInput(newTypeReduction.code)) 
      else if (newTypeReduction)
      newTypeErrors.code = newTypeReduction.code === "" || typesCodes.some((chambre) => sanitizeInput(chambre.code) === sanitizeInput(newTypeReduction.code)) 
      && sanitizeInput(newTypeReduction.code) != sanitizeInput(editingTypeReduction.code);
      newTypeErrors.type_reduction = newTypeReduction.type_reduction === "" || typesCodes.some((chambre) => sanitizeInput(chambre.type_reduction) === sanitizeInput(newTypeReduction.type_reduction || ""))
      && sanitizeInput(newTypeReduction.type_reduction) != sanitizeInput(editingTypeReduction.type_reduction);
      // Validation L'insertion de Tarif Chambre (Designation & Photo)
      const designations = tarifsReduction.filter((chambre) => chambre.designation);
      newTarifReductionErrors.designation = newDesignation.designation === "" || designations.some((chambre) => sanitizeInput(chambre.designation) === sanitizeInput(newDesignation.designation))
      && sanitizeInput(newDesignation.designation || "") != sanitizeInput(editingDesignation.designation || "");;
      newTarifReductionErrors.designationAdd = newDesignation.designation === "" || designations.some((chambre) => sanitizeInput(chambre.designation) === sanitizeInput(newDesignation.designation));
      setTarifReductionErrors(newTarifReductionErrors);
      setErrors(newErrors);
      setTypeErrors(newTypeErrors);
      return true;
    };
    validateData();
  }, [formData, newTypeReduction, newDesignation, selectedCategory]);

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const hasErrors = Object.values(errors).some(error => error === true);
      
      if (hasErrors) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;  
      }

      const url = editingTarifReduction 
          ? `http://localhost:8000/api/tarifs-reduction/${editingTarifReduction?.id}`
          : "http://localhost:8000/api/tarifs-reduction";
      const method = editingTarifReduction ? "put" : "post";

      let requestData;

      if (editingTarifReduction) {
        requestData = {
        type_reduction: formData.type_reduction,
        tarif_reduction: formData.designation,
        montant: formData.montant,
        percentage: formData.percentage
        }
      }
      else {
      const formDatad = new FormData();
      formDatad.append("type_reduction", formData.type_reduction);
      formDatad.append("tarif_reduction", formData.designation || selectedCategory);
      formDatad.append("montant", formData.montant);
      formDatad.append("percentage", formData.percentage);
      requestData = formDatad;
      } 
      try {
          const response = await axios({
              method: method,
              url: url,
              data: requestData,
          });
          
          if (response.status === 200 || response.status === 201) {
              fetchTarifReduction();
              const successMessage = `Tarif Reduction ${editingTarifReduction ? "modifié" : "ajouté"} avec succès.`;
              Swal.fire({
                  icon: "success",
                  title: "Succès!",
                  text: successMessage,
              });
              // Reset form and errors
              setSelectedProductsData([]);
              setSelectedProductsDataRep([]);
              setFormData({
                type_reduction: "",
                designation: "",
                montant: "",
                percentage: ""
              });
              setErrors({
                type_reduction: "", 
                designation: "",	
                montant: "",
                percentage: ""
              });
              setEditingTarifReduction(null);
              closeForm();
          }
      } catch (error) {
          if (error.response) {
              const serverErrors = error.response.data.error;
              
          }
          setTimeout(() => {
              setErrors({});
          }, 3000);
      }
  };


    //------------------------- Reduction FORM---------------------//

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
        type_reduction: "", 
        designation: "",	
        montant: "",
        percentage: ""
      });
      setErrors({
        type_reduction: "",
        designation: "", 	
        montant: "",
        percentage: ""
      });
      setSelectedProductsData([])
      setSelectedProductsDataRep([])
      setEditingTarifReduction(null); // Clear editing client
    };
  //-------------------------SITE CLIENT----------------------------//
  //-------------------------  SUBMIT---------------------//
  const handleSelectItem = (item) => {
    const selectedIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem?.id === item?.id
    );

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item?.id]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }

  };

  const getSelectedTarifReductionIds = () => {
    return selectedItems?.map((item) => item?.id);
  };
  
  
  //------------------------- CLIENT PAGINATION---------------------//

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const selectedRows = parseInt(event.target.value, 10);
    setRowsPerPage(selectedRows);
    localStorage.setItem('rowsPerPageReductions', selectedRows);  // Store in localStorage
    setPage(0);
  };

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem('rowsPerPageReductions');
    if (savedRowsPerPage) {
      setRowsPerPage(parseInt(savedRowsPerPage, 10));
    }
  }, []);

  //------------------------- CLIENT DELETE---------------------//

  const handleDelete = (tarif_reduction_code) => {
    Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ce tarif ?",
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
          .delete(`http://localhost:8000/api/tarifs-reduction/${tarif_reduction_code}`)
          .then(() => {
            fetchTarifReduction();
            Swal.fire({
              icon: "success",
              title: "Succès!",
              text: "Tarif Reduction supprimé avec succès.",
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response.data.error,
              });
            } else {
              console.error("Une erreur s'est produite :", error);
            }
          });
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
        // if (selectedItems.length == 0) {
        selectedItems.forEach((item) => {
          axios
            .delete(`http://localhost:8000/api/tarifs-reduction/${item}`)
            .then(() => {
              fetchTarifReduction();
              Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Tarif Reduction supprimé avec succès.",
              });
            })
            .catch((error) => {
              console.error("Erreur lors de la suppression du Tarif Reduction:", error);
              Swal.fire({
                icon: "error",
                title: "Erreur!",
                text: "Échec de la suppression du Tarif Reduction.",
              });
            });
        });
    // }
    // else {
    //   axios.delete('http://localhost:8000/api/delete-all-tarifs-reduction')
    //   .then(() => {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Succès!",
    //       text: "Toutes les reduction ont été supprimées.",
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Erreur lors de la suppression du reduction:", error);
    //     Swal.fire({
    //       icon: "error",
    //       title: "Erreur!",
    //       text: "Échec de la suppression du reduction.",
    //     });
    //   });
    // }
      }
    });
    setSelectedItems([]);
    fetchTarifReduction();
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tarifReduction?.map((TarifReduction) => TarifReduction?.id));
    }
  };
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems?.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const exportToExcel = () => {
    const table = document.getElementById('tarifReductionTable');
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Tarifs Reduction' });
    XLSX.writeFile(workbook, 'tarifs-reduction_table.xlsx');
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Manually adding HTML content
    const title = 'Table Tarifs Reduction';
    doc.text(title, 14, 16);
    
    doc.autoTable({
      head: [['Type Reduction Code', 'Type Reduction', 'Montant']],
      body: filteredTarifreduction?.map(tarifReduction => [
        tarifReduction?.id ? { content: 'Tarif Reduction Code', rowSpan: 1 } : '',
        tarifReduction.type_reduction.type_reduction || '',
        tarifReduction.montant || '',
        tarifReduction.percentage || '',
      ]),
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8, overflow: 'linebreak' },
      headStyles: { fillColor: '#007bff' }
    });
  
    doc.save('tarifs-reduction_table.pdf');
  };
  

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Tarifs Reduction List</title>
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
          <h1>Tarifs Reduction List</h1>
          <table>
            <thead>
              <tr>
                <th>Tarif Reduction Code</th>
                <th>Type Reduction</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTarifreduction?.map(tarifReduction => `
                <tr>
                  <td>${tarifReduction?.id || ''}</td>
                  <td>${tarifReduction.type_reduction.type_reduction || ''}</td>
                  <td>${tarifReduction.montant || ''}</td>
                  <td>${tarifReduction.percentage || ''}</td>
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
  
  //------------------ Zone --------------------//
  // const handleDeleteZone = async (zoneId) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:8000/api/types/${zoneId}`
  //     );
  //     Swal.fire({
  //       icon: "success",
  //       title: "Succès!",
  //       text: "Zone supprimée avec succès.",
  //     });
  //   } catch (error) {
  //     console.error("Error deleting zone:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Erreur!",
  //       text: "Échec de la suppression de la zone.",
  //     });
  //   }
  // };

  // const handleEditZone = async (zoneId) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8000/api/types/${zoneId}`
  //     );
  //     const zoneToEdit = response.data;

  //     if (!zoneToEdit) {
  //       console.error("Zone not found or data is missing");
  //       return;
  //     }

  //     const { value: editedZone } = await Swal.fire({
  //       title: "Modifier une zone",
  //       html: `
  //         <form id="editZoneForm">
  //             <input id="swal-edit-input1" class="swal2-input" placeholder="Zone" name="zone" value="${zoneToEdit.zone}">
  //         </form>
  //     `,
  //       showCancelButton: true,
  //       confirmButtonText: "Modifier",
  //       cancelButtonText: "Annuler",
  //       preConfirm: () => {
  //         const editedZoneValue =
  //           document.getElementById("swal-edit-input1").value;
  //         return { zone: editedZoneValue };
  //       },
  //     });

  //     if (editedZone && editedZone.zone !== zoneToEdit.zone) {
  //       const putResponse = await axios.put(
  //         `http://localhost:8000/api/types/${zoneId}`,
  //         editedZone
  //       );
  //       Swal.fire({
  //         icon: "success",
  //         title: "Succès!",
  //         text: "Zone modifiée avec succès.",
  //       });
  //     } else {
  //     }
  //   } catch (error) {
  //     console.error("Error editing zone:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Erreur!",
  //       text: "Échec de la modification de la zone.",
  //     });
  //   }
  //   fetchTarifReduction();
  // };

  // const handleAddZone = async () => {
  //   const { value: zoneData } = await Swal.fire({
  //     title: "Ajouter une zone",
  //     html: `
  //         <form id="addZoneForm">
  //             <input id="swal-input1" class="swal2-input" placeholder="Zone" name="zone">
  //         </form>
  //         <div class="form-group mt-3">
  //             <table class="table table-hover">
  //                 <thead>
  //                     <tr>
  //                         <th>Zone</th>
  //                         <th>Action</th>
  //                     </tr>
  //                 </thead>
  //                 <tbody>
  //                     ${types
  //                       ?.map(
  //                         (zone) => `
  //                         <tr key=${zone?.id}>
  //                             <td>${zone.zone}</td>
  //                             <td>
  //                                 <select class="custom-select" id="actionDropdown_${zone?.id}" class="form-control">
  //                                     <option class="btn btn-light" disabled selected value="">Select Action</option>
  //                                     <option class="btn btn-danger text-center" value="delete_${zone?.id}">Delete</option>
  //                                     <option class="btn btn-info text-center" value="edit_${zone?.id}">Edit</option>
  //                                 </select>
  //                             </td>
  //                         </tr>
  //                     `
  //                       )
  //                       .join("")}
  //                 </tbody>
  //             </table>
  //         </div>
  //     `,
  //     showCancelButton: true,
  //     confirmButtonText: "Ajouter",
  //     cancelButtonText: "Annuler",
  //     preConfirm: () => {
  //       const zone = Swal.getPopup().querySelector("#swal-input1").value;
  //       return { zone };
  //     },
  //   });

  //   if (zoneData) {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:8000/api/types",
  //         zoneData
  //       );
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success!",
  //         text: "Zone ajoutée avec succès.",
  //       });
  //     } catch (error) {
  //       console.error("Error adding zone:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Erreur!",
  //         text: "Échec de l'ajout de la zone.",
  //       });
  //     }
  //   }
  //   fetchTarifReduction();
  // };

  document.addEventListener("change", async function (event) {
    if (event.target && event.target?.id.startsWith("actionDropdown_")) {
      const [action, typeId] = event.target.value.split("_");
      if (action === "delete") {
        // Delete action
        handleDeleteReduction(typeId);
      } else if (action === "edit") {
        // Edit action
        handleEditReduction(typeId);
      }
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
};

const handleInputChange = (index, field, value) => {
  const updatedProducts = [...selectedProductsData];
  updatedProducts[index][field] = value;


  let newErrors = {...errors};
  if (field === 'name' && value === '') {
    newErrors.nb_lit = 'Le Nombre de lit est obligatoire.';
  } else {
    newErrors.nb_lit = '';
  }
  setSelectedProductsData(updatedProducts);

  setErrors(newErrors);
};
const handleInputChangeRep = (index, field, value) => {
  const updatedProducts = [...selectedProductsDataRep];
  updatedProducts[index][field] = value;
  let newErrors = {...errors};
  





  setErrors(newErrors);
  setSelectedProductsDataRep(updatedProducts);
};


const handleReductionFilterChange = (e) => {
  setTypeReduction(e.target.value);
};



const filteredTarifreduction = tarifReduction?.filter((tarifReduction) => {
  return (
    ((typeReduction ? tarifReduction?.type_reduction.type_reduction == typeReduction : true) &&
    (selectedCategory ? tarifReduction.tarif_reduction?.id
      === selectedCategory : true)) &&
    (
      (
        (searchTerm ? tarifReduction?.type_reduction?.type_reduction.toLowerCase().includes(searchTerm.toLowerCase()) : true) ||
        (searchTerm ? String(tarifReduction?.montant).includes(searchTerm) : true) ||
        (searchTerm ? String(tarifReduction?.percentage).includes(searchTerm) : true) 
      )
    )
  );
});


const handleAddReduction = async () => {
  try {
    const formData = new FormData();
    formData.append("type_reduction", newCategory.categorie);
    formData.append("montant", newCategory.categorie);
    formData.append("perecentage", newCategory.categorie);
    const response = await axios.post("http://localhost:8000/api/tarifs-reduction", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchTarifReduction(); // Refresh categories after adding
    setNewType({ type: "" })
    setNewMontant({ montant: "" })
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Tarif Reduction ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddCategory(false);

  } catch (error) {
    console.error("Error adding category:", error);
  }
};
const handleSaveReduction = async () => {
  try {
    await axios.put(`http://localhost:8000/api/types-reduction/${categorieId}`, newTypeReduction);
    await fetchTarifReduction(); // Refresh categories after adding
    setShowEditModal(false);
    setSelectedCategoryId([])
    // Fermer le modal
            Swal.fire({
        icon: "success",
        title: "Succès!",
        text: "Tarif Reduction modifiée avec succès.",
      });
  } catch (error) {
    console.error("Erreur lors de la modification de la catégorie :", error);
  }
};


const handleDeleteReduction = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/tarifs-reduction/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Reduction supprimée avec succès.",
    });
    await fetchTarifReduction(); // Refresh categories after adding

  } catch (error) {
    console.error("Error deleting categorie:", error);
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: "Échec de la suppression de la Type.",
    });
  }
};


const [activeIndex, setActiveIndex] = useState(0);
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
const chunks = chunkArray(tarifsReduction, chunkSize);


const handleCategoryFilterChange = (catId) => {
  setSelectedCategory(catId);
};
const handleAddTypeReduction = async () => {
  try {
    const formData = new FormData();
    formData.append("code", newTypeReduction.code);
    formData.append("type_reduction", newTypeReduction.type_reduction);
    const response = await axios.post("http://localhost:8000/api/types-reduction", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await fetchTarifReduction();
    if (response.status === 201) {
            Swal.fire({
                        icon: "success",
                        title: "Succès!",
                        text: "Type Reduction ajoutée avec succès.",
                      }); // Hide the modal after success
                      setShowAddCategory(false);
                      fetchTarifReduction();
            }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error
    }); 
    setShowAddCategory(false);
  }
};
const handleEditReduction
= (categorieId) => {
  setSelectedCategoryId(categorieId);
  setCategorie(categorieId?.id)
  setShowEditModal(true);
};
const handleDeleteTypeReduction = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/types-reduction/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Type Reduction supprimée avec succès.",
    });
    await fetchTarifReduction(); // Refresh categories after adding

  } catch (error) {
    console.error("Error deleting Type Reduction:", error);
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: "Échec de la suppression de la Type.",
    });
  }
};
const handleEditTypeReduction
= (categorieId) => {
  setNewTypeReduction(categorieId);
  setEditingTypeReduction(categorieId);
  setCategorie(categorieId?.id)
  setShowEditModal(true);
};
const handleAddDesignation = async () => {
  try {
    const hasErrors = Object.values(tarifReductionErrors).some(error => error === true);
      if (hasErrors) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;  
      }
    const formData = new FormData();
    if (newDesignation.photo) {
      formData.append('photo', newDesignation.photo);
    }
    formData.append("designation", newDesignation.designation);
    
    const response = await axios.post(
      "http://localhost:8000/api/desigs-reduction", formData
    );

    await fetchTarifReduction(); 
    Swal.fire({
                icon: "success",
                title: "Succès!",
                text: "Tarif Reduction ajoutée avec succès.",
              }); // Hide the modal after success
              setShowAddDesignation(false);
              setNewDesignation({
                photo: null,
                designation: "",
              })

  } catch (error) {
    console.error("Error adding designation:", error);
  }
};
const handleDeleteDesignation = async (categorieId) => {
  try {
    await axios.delete(`http://localhost:8000/api/desigs-reduction/${categorieId}`);
    
    // Notification de succès
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Reduction supprimée avec succès.",
    });
    await fetchTarifReduction(); // Refresh categories after adding

  } catch (error) {
    console.error("Error deleting Tarif Reduction:", error);
    Swal.fire({
      icon: "error",
      title: "Erreur!",
      text: "Échec de la suppression de la Tarif Reduction.",
    });
  }
};
const handleEditDesignation = (categorieId) => {
  setSelectedCategoryId(categorieId);
  setNewDesignation(categorieId);
  setCategorie(categorieId?.id);
  setEditingDesignation(categorieId);
  setShowEditModalDesignation(true);
};
const handleSaveDesignation = async () => {
  const formData = new FormData();
  formData.append('_method', 'put');
    if (newDesignation.photo) {
      formData.append('photo', newDesignation.photo);
    }
    formData.append("designation", selectedCategoryId.designation);

  try {
    const response = await axios.post(`http://localhost:8000/api/desigs-reduction/${categorieId}`,formData);

    await fetchTarifReduction(); // Refresh categories after adding
    setShowEditModalDesignation(false);
    
    // Show success message
    Swal.fire({
      icon: "success",
      title: "Succès!",
      text: "Tarif Reduction modifiée avec succès.",
    });
    
    // Clear the form state
    setNewDesignation({ designation: '', photo: null });
  } catch (error) {
    console.error("Erreur lors de la modification de la Tarif Reduction :", error.response.data);
  }
};
const displayAddTypeReduction = () => {
  setShowAddCategory(true)
  setTypeErrors({
    code: true,
    type_reduction: true
  })
}
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
              Liste des Tarifs
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
          <h5 className="container-d-flex justify-content-start AjouteBotton"style={{marginBottom:'3px'}} >Tarifs de Reduction</h5>
          <div className=" bgSecteur" >

<Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null}
nextIcon={<FaArrowRight size="2x" color="@ffffff" style={{backgroundColor:"black" ,borderRadius:'50%' ,marginTop:'-50px',marginRight:"5px",marginLeft:"-5px"}} />}
prevIcon={<FaArrowLeft size="2x" color="@ffffff" style={{backgroundColor:"black" ,borderRadius:'50%',marginTop:'-50px',marginRight:"-5px",marginLeft:"5px"}} />}>

{chunks?.map((chunk, chunkIndex) => (
<Carousel.Item key={chunkIndex}>
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
<a href="#" className="mx-5" key={index}>
<div 
className={`category-item ${selectedCategory === category?.id ? 'active' : ''}`} 
onClick={() => handleCategoryFilterChange(category?.id)}
>
<img
  src={category.photo ? `http://127.0.0.1:8000/storage/${category.photo}` : "http://localhost:8000/storage/reduction-img.webp"}
  alt={category.designation}
  loading="lazy"
className={`rounded-circle category-img ${selectedCategory === category?.id ? 'selected' : ''}`}
/>
<p className="category-text">{category.designation}</p>
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
                  />Ajouter un Tarif Reduction
              </a>

            </div>

            <div className="filters">
            

    <Form.Select aria-label="Default select example"
    value={typeReduction} onChange={handleReductionFilterChange}
    style={{width:'10%' ,height:"35px",position:'absolute', left: '81%',  top: '224px'}}>
    <option value="">Sélectionner Type Reduction</option>
    {typesReduction?.map((type) => (
        <option value={type.type_reduction}>
          {type.type_reduction}
        </option>
    ))}
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
                      {editingTarifReduction ? "Modifier" : "Ajouter"} un Tarif</h4>
                </Form.Label>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowAddDesignation(true)}
                  />
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Tarif Reduction</Form.Label>
                <Form.Select
                      name="designation"
                      isInvalid={!!errors.designation}
                      value={selectedCategory ? selectedCategory : formData.designation}
                      onChange={handleChange}>
                      <option value="">Sélectionner un Tarif Reduction</option>
                        {tarifsReduction?.map((tarif) => (
                            <option value={tarif?.id}>
                            {tarif?.designation}
                            </option>
                        ))}
                  </Form.Select>
              <Form.Text className="text-danger">
                {errors.designation}
              </Form.Text>
                </Form.Group>
                <Modal show={showEditModalDesignation} onHide={() => setShowEditModalDesignation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier un Tarif de Reduction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifReductionErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                  <Form.Text className="text-danger">{errors.photo}</Form.Text>
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                isInvalid={!!tarifReductionErrors.designation}
                value={newDesignation.designation}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
                />
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowEditModalDesignation(false)}  >
    Annuler
  </Fab>
      </Form.Group>
    </Modal>
                <Modal show={showAddDesignation} onHide={() => setShowAddDesignation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Tarif Reduction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form encType="multipart/form-data">
          <Form.Group>
                <Form.Label>Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    isInvalid={!!tarifReductionErrors.photo}
                    onChange={(e) => setNewDesignation({ ...newDesignation, photo: e.target.files[0] })}
                    className="form-control"
                    lang="fr"
                  />
                </Form.Group>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Designation"
                name="designation"
                isInvalid={!!tarifReductionErrors.designationAdd}
                onChange={(e) => setNewDesignation({ ...newDesignation, designation: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Designation</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tarifsReduction?.map(categ => (
                  <tr>
                    <td>{categ?.designation}</td>
                    <td>  
                    <img
                        src={categ.photo ? `http://127.0.0.1:8000/storage/${categ.photo}` : "http://localhost:8000/storage/reduction-img.webp"}
                        alt={categ.designation}
                        loading="lazy"
                        className={`rounded-circle category-img`}
                      />
                    </td>
                    <td>
                        <FontAwesomeIcon
                                  onClick={() => handleEditDesignation(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteDesignation(categ?.id)}
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
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddDesignation}
  >
    Valider
  </Fab>
  <Fab
    variant="extended"
    className="btn-sm FabAnnule mb-2 mx-2"
    onClick={() => setShowAddDesignation(false)}
  >
    Annuler
  </Fab>
  </Form.Group>
      </Modal.Body>
      </Modal>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <FontAwesomeIcon
                    icon={faPlus}
                    className=" text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={displayAddTypeReduction}
                  />
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Type Reduction</Form.Label>
                <Form.Select
                      name="type_reduction"
                      isInvalid={!!errors.type_reduction}
                      value={formData.type_reduction}
                      onChange={handleChange}>
                      <option value="">Sélectionner Type de Reduction</option>
                        {typesReduction?.map((tarif) => (
                            <option value={tarif?.id}>
                            {tarif.type_reduction}
                            </option>
                        ))}
                  </Form.Select>
              <Form.Text className="text-danger">
                {errors.type_reduction}
              </Form.Text>
                </Form.Group>
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modifier Type de Reduction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
        <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code"
                name="code"
                isInvalid={!!typeErrors.code}
                onChange={(e) => setNewTypeReduction({ ...newTypeReduction, code: e.target.value })}
                value={newTypeReduction.code}
                />
              <Form.Text className="text-danger">{errors.code}</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Type Reduction</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Reduction"
                name="type_reduction"
                isInvalid={!!typeErrors.type_reduction}
                onChange={(e) => setNewTypeReduction({ ...newTypeReduction, type_reduction: e.target.value })}
                value={newTypeReduction.type_reduction}
                />
              <Form.Text className="text-danger">{errors.type_reduction}</Form.Text>
            </Form.Group>
      </Form>
      </Modal.Body>
      
      <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleSaveReduction}
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
                <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Type Reduction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group>
              <Form.Label>Code Reduction</Form.Label>
              <Form.Control
                type="text"
                placeholder="Code Reduction"
                isInvalid={!!typeErrors.code}
                name="code"
                onChange={(e) => setNewTypeReduction({ ...newTypeReduction, code: e.target.value })}
              />
            </Form.Group>
          <Form.Group>
              <Form.Label>Type Reduction</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type Reduction"
                isInvalid={!!typeErrors.type_reduction}
                name="type_reduction"
                onChange={(e) => setNewTypeReduction({ ...newTypeReduction, type_reduction: e.target.value })}
              />
            </Form.Group>
      </Form>
            
            <Form.Group className="mt-3">
            <div className="form-group mt-3" style={{maxHeight:'500px',overflowY:'auto'}}>
            <table className="table">
              <thead>
                <tr>
                <th>Code Reduction</th>
                  <th>Type Reduction</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {typesReduction?.map(categ => (
                  <tr>
                    <td>{categ.code}</td>
                    <td>{categ.type_reduction}</td>
                    <td>
                   
    <FontAwesomeIcon
                                  onClick={() => handleEditTypeReduction(categ)}
                                  icon={faEdit}
                                  style={{
                                    color: "#007bff",
                                    cursor: "pointer",
                                  }}
                                />
                                <span style={{ margin: "0 8px" }}></span>
                                <FontAwesomeIcon
                                  onClick={() => handleDeleteTypeReduction(categ?.id)}
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
          <Form.Group className=" d-flex justify-content-center">
        
        <Fab
    variant="extended"
    className="btn-sm Fab mb-2 mx-2"
    type="submit"
    onClick={handleAddTypeReduction}
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
      </Modal.Body>
      </Modal>

                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Montant</Form.Label>
                <Form.Control
                type="number"
                name="montant"
                min="0"
                isInvalid={!!errors.montant}
                placeholder="Montant"
                value={formData.montant}
                onChange={handleChange}
            />
            <Form.Text className="text-danger">
                {errors.montant}
            </Form.Text>
                </Form.Group>
                <Form.Group className="col-sm-6 mt-2" style={{ display: 'flex', alignItems: 'center' }} controlId="calibre_id">
                <Form.Label className="col-sm-4" style={{ flex: '1',marginRight: '20px', marginLeft: '10px' ,marginTop:'7px'}}>Percentage</Form.Label>
                <Form.Control
                type="number"
                name="percentage"
                min="0"
                isInvalid={!!errors.percentage}
                placeholder="Percentage"
                value={formData.percentage}
                onChange={handleChange}
            />
            <Form.Text className="text-danger">
                {errors.percentage}
            </Form.Text>
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
            <div className="">
              <div
                id="tableContainer"
                className="table-responsive"
                style={{...tableContainerStyle, overflowX: 'auto', minWidth: '650px',
                  maxHeight: '700px', overflow: 'auto',

                  marginTop:'0px',
                }}
              >
                 <table className="table table-bordered" id="tarifReductionTable" style={{ marginTop: "-5px", }}>
  <thead className="text-center table-secondary" style={{ position: 'sticky', top: -1, backgroundColor: '#ddd', zIndex: 1,padding:'10px'}}>
    <tr className="tableHead">
      <th className="tableHead">
        <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
      </th>
      <th className="tableHead">Type Reduction</th>
      <th className="tableHead">Montant</th>
      <th className="tableHead">Percentage</th>
      <th className="tableHead">Action</th>
    </tr>
  </thead>
  <tbody className="text-center" style={{ backgroundColor: '#007bff' }}>
    {filteredTarifreduction
      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ?.map((tarifReduction) => {
      return(
        <React.Fragment>
          <tr>
      
            <td style={{ backgroundColor: "white" }}>
              <input
                type="checkbox"
                checked={selectedItems.some((item) => item === tarifReduction?.id)}
                onChange={() => handleCheckboxChange(tarifReduction?.id)}
              />
            </td>
            <td style={{ backgroundColor: "white" }}>{highlightText(tarifReduction?.type_reduction?.type_reduction, searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(String(tarifReduction?.montant), searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white" }}>{highlightText(String(tarifReduction?.percentage), searchTerm) || ''}</td>
            <td style={{ backgroundColor: "white", whiteSpace: "nowrap" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    <FontAwesomeIcon
      onClick={() => handleEdit(tarifReduction)}
      icon={faEdit}
      style={{ color: "#007bff", cursor: "pointer", marginRight: "10px" }}
    />
    <FontAwesomeIcon
      onClick={() => handleDelete(tarifReduction?.id)}
      icon={faTrash}
      style={{ color: "#ff0000", cursor: "pointer", marginRight: "10px" }}
    />
  </div>  
</td>
          </tr>

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
                  count={filteredTarifreduction?.length || 0}
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

export default TarifReduction;