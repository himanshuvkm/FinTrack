import React from 'react'
import AddTransactionForm from '../_components/transaction-form'
import { GetUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/category';

export default async function AddTransactionPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {

  // Fetch accounts
  const data = await GetUserAccounts();
  const accounts = data?.data ?? [];   // <-- FIX: never undefined

  const editId = searchParams?.edit ?? null;

  let initialData = null;

  return (
    <div className="max-w-3xl mx-auto px-5">

      <AddTransactionForm
        accounts={accounts}
        category={defaultCategories as any}   
        editMode={Boolean(editId)}
        initialData={initialData}
      />
    </div>
  );
}
