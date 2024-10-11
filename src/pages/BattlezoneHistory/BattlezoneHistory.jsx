import React, { useState, useEffect } from "react";
import styles from "./BattlezoneHistory.module.css";
import sampleData from "./leaders.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "./Modal"; // Import the Modal component
// import { decryptData } from "../../crypto/crypto.js";
import { base_url } from "../../baseUrl/baseUrl.js";
import axios from "axios";

const BattlezoneHistory = () => {
  const initialData = sampleData;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedData, setSelectedData] = useState(null); // Data for the selected row
  const [allGames, setAllGames] = useState([]);
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const decryptedData = decryptData(userData?.data);
  // console.log("token passing:", decryptedData?.token);
  useEffect(() => {
    // const fetchAllGamesTransaction = async () => {

    //   const fullUrl = `${base_url}/admin/games`;
    //   console.log("Requesting URL:", fullUrl); // Log the full URL

    //   try {
    //     const response = await fetch(fullUrl, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${decryptedData?.token}`, // Add decrypted data to the headers
    //       },
    //     });

    //     console.log("response for all transaction ", response);
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }

    //     const data = await response.json();
    //     console.log("data from all trans", data);
    //     const decryptedDataAllGamesTransactionList = decryptData(data?.data);
    //     setAllGames(decryptedDataAllGamesTransactionList); // Assuming the response is an array of profiles
    //     console.log(
    //       "decrypted Data listing for decryptedDataAllGamesTransactionList",
    //       decryptedDataAllGamesTransactionList
    //     );
    //   } catch (err) {
    //     console.error(
    //       "Error fetching decrypted Data AllGames TransactionList:",
    //       err
    //     );
    //   }
    // };
    // fetchAllGamesTransaction();

    setLoading(true);

    axios.get(`${base_url}/api/admin/battles`, {
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    }).then((data) => {
      console.log("all battels data", data.data);
      setAllGames(data?.data.data)
      setLoading(false);

    }).catch((er) => {
      console.log(er);

    })

  }, []);

  useEffect(() => {
    const dataWithSerialNumbers = allGames?.map((item, index) => ({
      ...item,
      serialNumber: (index + 1).toString().padStart(2, "0"),
    }));
    // Set a delay before setting the data and loading state
    setTimeout(() => {
      setData(dataWithSerialNumbers);
      setLoading(false);
    }, 1000);
  }, [initialData, currentPage, rowsPerPage]);

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;
  const currentData = data.slice(firstIndex, lastIndex);

  const nextPage = () => {
    if (lastIndex < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (item) => {
    setSelectedData(item); // Set the selected item data
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Hide the modal
  };
  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>S.NO.</th>
              <th>Name</th>
              <th>Game Duration</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Creator ID</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={index}>
                  <td>
                    <Skeleton height={40} className={styles.rowSkeleton} />
                  </td>
                </tr>
              ))
              : allGames?.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td>{item?.name}</td>
                  <td>{item?.gameDuration}</td>
                  <td>{item?.fee}</td>
                  <td>{item?.status}</td>
                  <td>{item?.creator._id}</td>

                  {/* <td>
                      <button
                        className={styles.button}
                        onClick={() => openModal(item)}
                      >
                        VIEW
                      </button>
                    </td> */}

                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* <div className={styles.divider}></div> */}

      <div className={styles.footer}>
        <div className={styles.rowsPerPage}>
          <label htmlFor="rowsPerPage">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <div>
          {firstIndex + 1}-{Math.min(lastIndex, data.length)} of {data.length}
        </div>
        <div className={styles.nextPrevBtnsDiv}>
          <div className={styles.prevBtn} onClick={prevPage}>
            <SkipPreviousIcon />
          </div>
          <div>
            <ArrowBackIosIcon className={styles.arrowbtn} />
            <ArrowForwardIosIcon className={styles.arrowbtn} />
          </div>
          <div className={styles.nextBtn} onClick={nextPage}>
            <SkipNextIcon />
          </div>
        </div>
      </div>

      {/* Render the modal and pass the selected data */}
      <Modal
        showModal={showModal}
        closeModal={closeModal}
        data={selectedData}
      />
    </SkeletonTheme>
  );
};

export default BattlezoneHistory;
