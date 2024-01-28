/* 
==> Loading data into components <==
objectivenes:
1. how loader function works
2. loader function behaviour within our without pages rendering
3. loader function without pages rendering => as an api (parallel)
3. loader function with pages rendering => common pages (some waterfall happen: by chunks or any assets)
*/

import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader() {
  return json([
    {
      id: 1,
      fName: "Sandiko",
      lName: "Dev",
    },
    {
      id: 2,
      fName: "Second",
      lName: "Name",
    },
  ]);
}

export default function Pages() {
  let people = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>people</h1>
      {people.length ? (
        <ul>
          {people.map((person) => (
            <li>
              {person.fName} {person.lName}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nobody here been listed!</p>
      )}
    </main>
  );
}
