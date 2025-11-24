import { useParams } from "react-router-dom";
import DogForm from "../components/DogForm";

export default function EditPuppy() {
  const { id } = useParams();
  return <DogForm dogId={id} isEdit={true} isPuppy={true} />;
}
