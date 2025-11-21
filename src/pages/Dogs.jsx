import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import placeholder from "../assets/placeholder.png";
import "../styles/Dogs.css";

export default function Dogs() {
  const { isAdmin } = useAdmin();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const querySnapshot = await getDocs(collection(db, "dogs"));
        const dogsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
let imageUrl = placeholder;
if (data.images && data.images.length > 0) {
  try {
    imageUrl = await getDownloadURL(ref(storage, data.images[0])); 
  } catch {}
}

            return {
              id: doc.id,
              ...data,
              image: imageUrl,
            };
          })
        );

        setDogs(dogsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dogs:", err);
      }
    }

    fetchDogs();
  }, []);

  return (
    <main className="dogs-page">
      <h1>Nos Chiens</h1>
      {loading ? <p>Loading dogs...</p> : (
        <div className="dog-grid">
          {dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <Link to={`/chiens/${dog.id}`}>
                <img src={dog.image || placeholder} alt={dog.name} />

                <p className="dog-name">{dog.name}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
