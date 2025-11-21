import React from 'react'
import AddTransactionForm from '../_components/transaction-form'
import { GetUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/category';
import { getTransaction } from '@/actions/transaction';


export default async function AddTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ [edit: string]: string | string[]  }>
}) {
  const filters = (await searchParams)


  const data = await GetUserAccounts();
  const accounts = data?.data ?? [];   

  const editId = filters.edit;
 

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

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
