/* One case, following the design system's "review and action" example: the
 * case details on the left, and a decision form on the right.
 *
 * The decision isn't saved anywhere. It shows a confirmation, and is gone when
 * you leave the page.
 */

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  GoabBadge,
  GoabBlock,
  GoabButton,
  GoabCallout,
  GoabContainer,
  GoabDropdown,
  GoabDropdownItem,
  GoabFormItem,
  GoabGrid,
  GoabLink,
  GoabRadioGroup,
  GoabRadioItem,
  GoabText,
  GoabTextArea,
} from "@abgov/react-components";
import type {
  GoabDropdownOnChangeDetail,
  GoabRadioGroupOnChangeDetail,
  GoabTextAreaOnChangeDetail,
} from "@abgov/ui-components-common";

import { findCase, statusBadge } from "../data/sample";
import { formatDate } from "../shared/formatDate";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <GoabBlock direction="column" gap="3xs" width="100%">
      <GoabText size="body-xs" color="secondary" mt="none" mb="none">
        {label}
      </GoabText>
      <GoabText size="body-s" mt="none" mb="none">
        {value}
      </GoabText>
    </GoabBlock>
  );
}

function BackToCases() {
  return (
    <GoabLink leadingIcon="arrow-back" size="small" mb="none">
      <Link to="/internal">Back to cases</Link>
    </GoabLink>
  );
}

export function CasePage() {
  const { caseId } = useParams();
  const sampleCase = findCase(caseId);

  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({ decision: "", reason: "" });
  const [recorded, setRecorded] = useState(false);

  if (!sampleCase) {
    return (
      <>
        <BackToCases />
        <GoabText tag="h1" size="heading-m" mt="xl" mb="s">
          Case not found
        </GoabText>
        <GoabText size="body-s" mt="none" mb="none">
          There's no case with the ID {caseId}. Check the ID, or go back to the list of cases.
        </GoabText>
      </>
    );
  }

  const recordDecision = () => {
    const found = {
      decision: decision ? "" : "Select a decision",
      reason: decision === "deny" && !reason ? "Select a reason" : "",
    };
    setErrors(found);
    if (found.decision || found.reason) return;
    setRecorded(true);
  };

  return (
    <>
      <BackToCases />
      <GoabText tag="h1" size="heading-m" mt="xl" mb="xs">
        {sampleCase.name}
      </GoabText>
      <GoabBlock gap="s" alignment="center" mb="xl">
        <GoabText size="body-xs" color="secondary" mt="none" mb="none">
          {sampleCase.id}
        </GoabText>
        <GoabBadge type={statusBadge[sampleCase.status]} content={sampleCase.status} icon={false} />
      </GoabBlock>

      <GoabGrid minChildWidth="315px" gap="l">
        <GoabContainer accent="thin" type="non-interactive" padding="compact">
          <GoabBlock direction="column" gap="m" width="100%">
            <GoabText tag="h2" size="heading-xs" mt="none" mb="none">
              Application details
            </GoabText>
            <GoabBlock direction="column" gap="s" width="100%">
              <GoabGrid minChildWidth="200px" gap="s">
                <Detail label="Name" value={sampleCase.name} />
                <Detail label="Date of birth" value={formatDate(sampleCase.dateOfBirth)} />
                <Detail label="Contact method" value={sampleCase.contactMethod} />
                <Detail label="Submitted" value={formatDate(sampleCase.submitted)} />
              </GoabGrid>
              <Detail
                label="More information from the applicant"
                value={sampleCase.notes || "None given."}
              />
            </GoabBlock>
          </GoabBlock>
        </GoabContainer>

        <GoabContainer accent="thin" type="non-interactive" padding="compact">
          <GoabBlock direction="column" gap="m" width="100%">
            <GoabText tag="h2" size="heading-xs" mt="none" mb="none">
              Decision
            </GoabText>

            {recorded ? (
              <GoabCallout type="success" heading="Decision recorded" mb="none">
                <GoabText size="body-s" mt="none" mb="none">
                  You {decision === "approve" ? "approved" : "denied"} this application. In a real
                  service the applicant would now be told.
                </GoabText>
              </GoabCallout>
            ) : (
              <GoabBlock direction="column" gap="m" width="100%">
                <GoabFormItem
                  label="Approve or deny this application"
                  labelSize="compact"
                  error={errors.decision}
                >
                  <GoabRadioGroup
                    name="decision"
                    size="compact"
                    orientation="horizontal"
                    value={decision}
                    error={!!errors.decision}
                    onChange={(detail: GoabRadioGroupOnChangeDetail) => {
                      setDecision(detail.value);
                      setErrors({ decision: "", reason: "" });
                    }}
                  >
                    <GoabRadioItem value="approve" label="Approve" />
                    <GoabRadioItem value="deny" label="Deny" />
                  </GoabRadioGroup>
                </GoabFormItem>

                {decision === "deny" && (
                  <GoabFormItem label="Reason for denying" labelSize="compact" error={errors.reason}>
                    <GoabDropdown
                      name="reason"
                      size="compact"
                      width="100%"
                      value={reason}
                      error={!!errors.reason}
                      onChange={(detail: GoabDropdownOnChangeDetail) => {
                        setReason(detail.value ?? "");
                        setErrors((e) => ({ ...e, reason: "" }));
                      }}
                    >
                      <GoabDropdownItem value="incomplete" label="Application is incomplete" />
                      <GoabDropdownItem value="not-eligible" label="Doesn't meet the criteria" />
                      <GoabDropdownItem value="documents" label="Documents couldn't be checked" />
                    </GoabDropdown>
                  </GoabFormItem>
                )}

                <GoabFormItem label="Note" labelSize="compact" requirement="optional">
                  <GoabTextArea
                    name="note"
                    size="compact"
                    rows={4}
                    width="100%"
                    value={note}
                    onChange={(detail: GoabTextAreaOnChangeDetail) => setNote(detail.value)}
                  />
                </GoabFormItem>

                <GoabBlock>
                  <GoabButton size="compact" onClick={recordDecision}>
                    Record decision
                  </GoabButton>
                </GoabBlock>
              </GoabBlock>
            )}
          </GoabBlock>
        </GoabContainer>
      </GoabGrid>
    </>
  );
}
