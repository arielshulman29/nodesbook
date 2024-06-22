import { Suspense } from "react";
import PersonForm from "../_components/forms/PersonForm/PersonForm";
import { Label } from "../_components/shared/styled";

export default function PersonPage() {
  return (
    <Suspense fallback={<Label>Loading...</Label>}>
      <PersonForm />
    </Suspense>
  );
}
