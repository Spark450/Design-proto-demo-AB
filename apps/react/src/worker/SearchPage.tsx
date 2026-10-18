/* Search the sample cases by name or case ID. The list narrows as you type. */

import { useState } from "react";
import { Link } from "react-router-dom";
import { GoabBadge, GoabFormItem, GoabInput, GoabTable, GoabText } from "@abgov/react-components";
import type { GoabInputOnChangeDetail } from "@abgov/ui-components-common";
import { sampleCases, statusBadge } from "../data/sample";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const matches = term
    ? sampleCases.filter(
        (c) => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term),
      )
    : [];

  return (
    <>
      <GoabText tag="h1" size="heading-m" mt="none" mb="xl">
        Search
      </GoabText>

      <GoabFormItem
        label="Name or case ID"
        labelSize="compact"
        helpText="For example, Test Person A or SAMPLE-001"
      >
        <GoabInput
          name="search"
          size="compact"
          type="search"
          leadingIcon="search"
          width="460px"
          value={query}
          onChange={(detail: GoabInputOnChangeDetail) => setQuery(detail.value)}
        />
      </GoabFormItem>

      {term && matches.length === 0 && (
        <GoabText size="body-s" mt="xl" mb="none">
          No cases match "{query.trim()}".
        </GoabText>
      )}

      {matches.length > 0 && (
        <div className="table--list-sizing search-results">
          <GoabTable width="100%">
            <thead>
              <tr>
                <th>Status</th>
                <th>Case</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((row) => (
                <tr key={row.id}>
                  <td>
                    <GoabBadge type={statusBadge[row.status]} content={row.status} icon={false} />
                  </td>
                  <td>
                    <Link to={`/internal/cases/${row.id}`}>{row.id}</Link>
                  </td>
                  <td>{row.name}</td>
                </tr>
              ))}
            </tbody>
          </GoabTable>
        </div>
      )}
    </>
  );
}
