/* 
==> Loading data into components <==
objectivenes:
1. how loader function works
2. loader function behaviour within our without pages rendering
3. loader function without pages rendering => as an api (parallel)
3. loader function with pages rendering => common pages (some waterfall happen: by chunks or any assets)
*/

import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getData, updateData } from "~/utils/storages";

export async function action({ request }: ActionFunctionArgs) {
  let oldData = await getData();

  let formData = await request.formData();
  let values = {
    fName: formData.get("fName") as string,
    lName: formData.get("lName") as string,
  };

  let newData = oldData.concat({
    id: oldData.length + 1,
    ...values,
  });

  await updateData(newData);

  return redirect("/people");
}

export async function loader() {
  let data = await getData();
  return json(data);
}

export default function Pages() {
  let people = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>people</h1>
      {people.length ? (
        <ul>
          {people.map((person, id) => (
            <li key={id}>
              {person.fName} {person.lName}
            </li>
          ))}
          <li>
            <Form method="POST">
              <input type="text" name="fName" />
              <input type="text" name="lName" />
              <button type="submit">Add</button>
            </Form>
          </li>
        </ul>
      ) : (
        <>
          <h2>Nobody here been listed!</h2>
          <Form method="POST">
            <input type="text" name="fName" />
            <input type="text" name="lName" />
            <button type="submit">Add</button>
          </Form>
        </>
      )}
    </main>
  );
}
