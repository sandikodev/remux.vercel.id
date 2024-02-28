/* 
==> Loading data into components <==
objectivenes:
1. how loader function works
2. loader function behaviour within our without pages rendering
3. loader function without pages rendering => as an api (parallel)
3. loader function with pages rendering => common pages (some waterfall happen: by chunks or any assets)
*/

import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Person, getData, updateData } from "~/utils/storages";

export async function action({ request }: ActionFunctionArgs) {
  let oldData = await getData();
  let newData: Array<Person> = [];

  let formData = await request.formData();
  let isAction = formData.get("_action");

  switch (isAction) {
    case "create":
      let values = {
        fName: formData.get("fName") as string,
        lName: formData.get("lName") as string,
      };

      newData = oldData.concat({
        id: oldData.length + 1,
        ...values,
      });

      break;
    case "delete":
      let id = formData.get("unique") as string;
      let unique_id = parseInt(id, 10);
      newData = oldData.filter((data) => data.id != unique_id);
      break;
    default:
      console.log("error, Action undefined!");
      break;
  }

  await updateData(newData);
  return redirect("/people");
}

export async function loader() {
  let data = await getData();
  return json(data);
}

export default function Pages() {
  let people = useLoaderData<typeof loader>();
  let navigation = useNavigation();
  let isAdding =
    navigation.state == "submitting" &&
    navigation.formData?.get("_action") == "create";

  let formRef = useRef<HTMLFormElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [isAdding]);

  return (
    <main>
      <h1>people</h1>
      {people.length ? (
        <ul>
          {people.map((person, id) => (
            <People data={person} key={id} />
          ))}
          <li>
            <Form ref={formRef} method="POST">
              <input ref={inputRef} type="text" name="fName" />
              <input type="text" name="lName" />
              <ButtonWrapper state={isAdding} />
            </Form>
          </li>
        </ul>
      ) : (
        <>
          <h2>Nobody here been listed!</h2>
          <Form ref={formRef} method="POST">
            <input type="text" name="fName" />
            <input type="text" name="lName" />
            <ButtonWrapper state={isAdding} />
          </Form>
        </>
      )}
    </main>
  );
}

const ButtonWrapper = ({ state }: { state: boolean }) => {
  return (
    <button disabled={state} type="submit" name="_action" value="create">
      {state ? "Adding" : "Add"}
    </button>
  );
};

const People = ({ data }: { data: Person }) => {
  let navigation = useNavigation();
  let isDeleted =
    (navigation.state == "submitting" || navigation.state == "loading") &&
    navigation.formData?.get("_action") == "delete" &&
    parseInt(navigation.formData?.get("unique") as string, 10) == data.id;

  console.log(navigation);
  return (
    <li style={{ opacity: isDeleted ? 0.25 : 1 }}>
      {data.fName} {data.lName}
      <Form method="POST" style={{ display: "inline" }}>
        <input type="hidden" name="unique" value={data.id} />
        <button type="submit" name="_action" value="delete">
          X
        </button>
      </Form>
    </li>
  );
};
