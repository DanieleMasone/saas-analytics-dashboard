import type {Customer, CustomerFilters, CustomersResponse} from "@/types/dashboard";

/** Apply customer search, filters, pagination, and filtered-set summary metrics. */
export function queryCustomers(
    customers: readonly Customer[],
    filters: CustomerFilters,
): CustomersResponse {
  const pageSize = filters.pageSize ?? 8;
  const query = filters.query?.trim().toLowerCase() ?? "";
  const status = filters.status ?? "all";
  const plan = filters.plan ?? "all";

  // Search intentionally spans business fields that operators scan most often.
  const filtered = customers.filter((customer) => {
    const matchesQuery =
        query.length === 0 ||
        [customer.company, customer.owner, customer.region]
            .join(" ")
            .toLowerCase()
            .includes(query);
    const matchesStatus = status === "all" || customer.status === status;
    const matchesPlan = plan === "all" || customer.plan === plan;

    return matchesQuery && matchesStatus && matchesPlan;
  });

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const page = Math.min(Math.max(filters.page ?? 1, 1), totalPages);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  const mrrCustomers = filtered.filter((customer) => customer.status !== "churned");

  // Summary values are derived from the filtered set so side panels match the table.
  return {
    data,
    page,
    pageSize,
    total: filtered.length,
    totalPages,
    summary: {
      active: filtered.filter((customer) => customer.status === "active").length,
      atRisk: filtered.filter((customer) => customer.status === "past_due").length,
      averageHealth:
          filtered.length === 0
              ? 0
              : Math.round(
                  filtered.reduce((total, customer) => total + customer.healthScore, 0) /
                  filtered.length,
              ),
      totalMrr: mrrCustomers.reduce((total, customer) => total + customer.mrr, 0),
      trial: filtered.filter((customer) => customer.status === "trial").length,
    },
  };
}
