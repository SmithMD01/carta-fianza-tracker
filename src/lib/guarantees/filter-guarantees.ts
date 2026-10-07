import type { Guarantee } from "@/types/guarantee";
import type { GuaranteeColumnFilters, GuaranteeQuestion,
} from "@/types/guarantee-filters";
import {
  getGuaranteeRemainingDays,
  matchesGuaranteeQuestion,
  matchesMultiValueFilter,
} from "@/lib/guarantees/guarantee-filter-rules";

type FilterGuaranteesParams = {
  search: string;
  selectedStatus: string;
  selectedInsurer: string;
  selectedQuestion: GuaranteeQuestion;
  columnFilters: GuaranteeColumnFilters;
};

function includesText(value: string, search: string) {
  return value.toLowerCase().includes(search);
}

export function filterGuarantees(
  guarantees: Guarantee[],
  filters: FilterGuaranteesParams,
) {
  const normalizedSearch = filters.search.toLowerCase().trim();

  return guarantees.filter((guarantee) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        guarantee.projectCode,
        guarantee.projectCui,
        guarantee.projectName,
        guarantee.entityName,
        guarantee.insurerName,
        guarantee.guaranteeNumber,
        guarantee.guaranteeReason,
      ].some((value) => includesText(value, normalizedSearch));

    const matchesSelectedStatus =
      filters.selectedStatus === "all" ||
      guarantee.status === filters.selectedStatus;

    const matchesSelectedInsurer =
      filters.selectedInsurer === "all" ||
      guarantee.insurerName === filters.selectedInsurer;

    const columnFilters = filters.columnFilters;

    const matchesColumnFilters =
      `${guarantee.projectCode} ${guarantee.projectCui}`
        .toLowerCase()
        .includes(columnFilters.project.toLowerCase()) &&
      includesText(
        guarantee.projectName,
        columnFilters.projectName.toLowerCase(),
      ) &&
      includesText(
        guarantee.entityName,
        columnFilters.entity.toLowerCase(),
      ) &&
      matchesMultiValueFilter(
        guarantee.insurerName,
        columnFilters.insurer,
      ) &&
      includesText(
        guarantee.guaranteeNumber,
        columnFilters.guaranteeNumber.toLowerCase(),
      ) &&
      includesText(
        guarantee.guaranteeReason,
        columnFilters.reason.toLowerCase(),
      ) &&
      matchesMultiValueFilter(
        guarantee.status,
        columnFilters.status,
      ) &&
      String(guarantee.guaranteeValue).includes(
        columnFilters.guaranteeValue,
      ) &&
      String(guarantee.projectValue).includes(
        columnFilters.projectValue,
      ) &&
      String(guarantee.premium).includes(
        columnFilters.premium,
      ) &&
      String(guarantee.collateral).includes(
        columnFilters.collateral,
      ) &&
      String(guarantee.collateralPercentage).includes(
        columnFilters.collateralPercentage,
      ) &&
      guarantee.validFrom.includes(columnFilters.validFrom) &&
      guarantee.expiresAt.includes(columnFilters.expiresAt) &&
      String(getGuaranteeRemainingDays(guarantee)).includes(
        columnFilters.renewalDays,
      ) &&
      (!columnFilters.guaranteeGroups ||
        columnFilters.guaranteeGroups
          .split("|")
          .some((group) =>
            guarantee.guaranteeGroups.includes(group),
          )) &&
      matchesMultiValueFilter(
        guarantee.projectStage,
        columnFilters.projectStage,
      );

    return (
      matchesSearch &&
      matchesSelectedStatus &&
      matchesSelectedInsurer &&
      matchesGuaranteeQuestion(
        guarantee,
        filters.selectedQuestion,
      ) &&
      matchesColumnFilters
    );
  });
}