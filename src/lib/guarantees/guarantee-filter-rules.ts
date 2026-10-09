import type { Guarantee } from "@/types/guarantee";
import type { GuaranteeQuestion } from "@/types/guarantee-filters";
import {
  isAddendumGuarantee,
  isConventionGuarantee,
} from "@/config/business-options";

export function isActiveGuarantee(guarantee: Guarantee) {
  return guarantee.status === "Activa";
}

export function isNearExpiry(guarantee: Guarantee) {
  const remainingDays = getGuaranteeRemainingDays(guarantee);

  const eligibleStatus =
    guarantee.status === "Activa" ||
    guarantee.status === "Vencida";

  return eligibleStatus && remainingDays <= 60;
}

export function matchesGuaranteeQuestion(
  guarantee: Guarantee,
  question: GuaranteeQuestion,
) {
  if (question === "all") {
    return true;
  }

  if (question === "solicitadas") {
    return guarantee.status === "Solicitud";
  }

  if (question === "por-vencer") {
    return isNearExpiry(guarantee);
  }

  if (question === "encaje-pendiente") {
    return guarantee.collateral > 0;
  }

  if (question === "adenda") {
    return (
      guarantee.status === "Solicitud" &&
      isAddendumGuarantee(
        guarantee.wonWith,
        guarantee.guaranteeReason,
      )
    );
  }

  if (question === "convenio") {
    return (
      guarantee.status === "Solicitud" &&
      isConventionGuarantee(
        guarantee.wonWith,
        guarantee.guaranteeReason,
      )
    );
  }

  return false;
}

export function matchesMultiValueFilter(
  value: string,
  filter: string,
) {
  if (!filter) {
    return true;
  }

  return filter.split("|").includes(value);
}

export function getGuaranteeRemainingDays(guarantee: Guarantee) {
  const targetDate =
    guarantee.status === "Solicitud"
      ? guarantee.validFrom
      : guarantee.expiresAt;

  if (!targetDate) {
    return 0;
  }

  const date = new Date(`${targetDate}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (date.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );
}