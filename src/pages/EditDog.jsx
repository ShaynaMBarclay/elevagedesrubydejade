import { useParams } from "react-router-dom";
import DogForm from "../components/DogForm";

export default function EditDog() {
  const { id } = useParams();
  return <DogForm dogId={id} isEdit={true} />;
}
