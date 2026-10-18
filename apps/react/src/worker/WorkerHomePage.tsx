/* The worker landing page: a heading and a short list of sample cases.
 *
 * The table follows the design system's "Show status in a table" example. The
 * data comes from src/data/sample.ts and is all made up.
 */

import { Link } from "react-router-dom";
import { GoabBadge, GoabTable, GoabText } from "@abgov/react-components";
import { sampleCases, statusBadge } from "../data/sample";
import { formatDate } from "../shared/formatDate";

export function WorkerHomePage() {
  return (
    <>
      <GoabText tag="h1" size="heading-m" mt="none" mb="xs">
        Cases
      </GoabText>
      <GoabText size="body-s" color="secondary" mt="none" mb="xl">
        Sample cases to show how a worker screen looks. None of this is real.
      </GoabText>

      <div className="table--list-sizing">
        <GoabTable width="100%">
          <thead>
            <tr>
              <th>Status</th>
              <th>Case</th>
              <th>Name</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {sampleCases.map((row) => (
              <tr key={row.id}>
                <td>
                  <GoabBadge type={statusBadge[row.status]} content={row.status} icon={false} />
                </td>
                <td>
                  <Link to={`/internal/cases/${row.id}`}>{row.id}</Link>
                </td>
                <td>{row.name}</td>
                <td>{formatDate(row.submitted)}</td>
              </tr>
            ))}
          </tbody>
        </GoabTable>
      </div>
    </>
  );
}
