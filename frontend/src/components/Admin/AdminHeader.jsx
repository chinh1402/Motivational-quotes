import React from 'react'

function AdminHeader() {
  return (
    <>
        <a
          href="/admin"
          className="col-span-1 text-[2.4rem] font-bold leading-[4.8rem] dark:text-textColor-dark"
        >
          <span className="text-primary-light dark:text-primary-dark">MQ</span>Admin.
        </a>
        <div className="col-span-10"></div>
        <a
          href="/login"
          className="col-span-1 text-[1.6rem] font-light leading-[2.4rem] p-[12px] w-[100px] dark:text-textColor-dark"
        >
          Sign out
        </a>
    </>
  )
}

export default AdminHeader