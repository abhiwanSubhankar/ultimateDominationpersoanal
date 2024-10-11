import styles from "./UserData.module.css";
import { useState, useEffect } from "react";
import sampleData from "./leaders.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../crypto/crypto.js";
import axios from "axios";
import { base_url } from "../../baseUrl/baseUrl.js";
import Button from "../../components/buttons/Button.jsx";


const UserData = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);
  console.log("profiles", profiles);
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const decryptedData = decryptData(userData?.data);
  // console.log("token passing:", decryptedData?.token); // Log the full URL

  const [userData, setUserData] = useState([])

  useEffect(() => {
    setLoading(true);
    // const fetchActiveProfiles = async () => {
    // const fullUrl = `${base_url}/admin/profiles/active`;
    // console.log("Requesting URL:", fullUrl); // Log the full URL

    //   try {
    //     const response = await fetch(fullUrl, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${"token"}`, // Add decrypted data to the headers
    //       },
    //     });

    //     console.log("response for active user ", response);
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }

    //     const data = await response.json();
    //     // const decryptedDataUserList = decryptData(data?.data);
    //     // setProfiles(decryptedDataUserList); // Assuming the response is an array of profiles
    //     console.log(
    //       "decrypted Data listing for active users",
    //       decryptedDataUserList
    //     );
    //   } catch (err) {
    //     console.error("Error fetching active profiles:", err);
    //     setError("Failed to fetch active profiles");
    //   }
    // };

    // fetchActiveProfiles();


    axios.get(`${base_url}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    }).then((data) => {

      console.log("user data", data);
      setUserData(data?.data.data)
      setLoading(false);

    }).catch((er) => {
      console.log(er);

    })
  }, []);

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  const initialData = sampleData;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataWithSerialNumbers = initialData.map((item, index) => ({
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
  const navigate = useNavigate();

  const handleViewClick = (item) => {
    const id = item?._id;
    navigate(`/user/${id}`, { state: { user: item } });
  };



  return (
    <SkeletonTheme baseColor="transparent" highlightColor="#ddd">
      {/* <div className={styles.container}> */}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>S.NO.</th>
                <th>Wallet Address</th>
                <th>Balance</th>
                <th>WinStreaks</th>
                {/* <th>ACTION</th> */}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {loading
                ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton height={10} className={styles.rowSkeleton} />
                    </td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                  </tr>
                ))
                : userData?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{truncateAddress(item?.walletAddress)}</td>
                    <td>{item?.balance}</td>
                    <td>{item?.winStreaks}</td>
                    {/* <td>
                    <Button
                      className={styles.button}
                      onClick={() => handleViewClick(item)}
                      text={"View"}
                    >
                    </Button>
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

      {/* </div> */}
    </SkeletonTheme>

  );
};

export default UserData;
