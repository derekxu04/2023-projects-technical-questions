import { SetStateAction, Dispatch, FormEvent } from "react";
import { TableContents } from "../Table/Table";

interface AlertModalProps {
  contents: TableContents;
  useContents: Dispatch<SetStateAction<TableContents>>;
}

export default function AlertModal({ contents, useContents }: AlertModalProps) {
  function onSubmitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newAlert = {
      alert: (e.target as any).elements[0].value,
      status: "",
      updates: [],
    };

    let newContents = { ...contents };
    newContents.rowContents.push(newAlert);

    useContents(newContents);
  }

  return (
    <form data-testid="form" onSubmit={onSubmitEvent}>
      <label> Add new alert: </label>
      <input type="text" id="alert" name="alert" />
      <button type="submit"> Add </button>
    </form>
  );
}
