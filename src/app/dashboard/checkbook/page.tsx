import { getCategories, getTransactions } from "../../actions/finance";
import CheckbookLedger from "./CheckbookLedger";

export default async function CheckbookPage() {
  const [categoriesRes, transactionsRes] = await Promise.all([
    getCategories(),
    getTransactions(),
  ]);

  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
  const transactions = transactionsRes.success && transactionsRes.data ? transactionsRes.data : [];

  return (
    <CheckbookLedger initialTransactions={transactions} categories={categories} />
  );
}
