import React from "react";
import DaisyUICustomToggle from "../../../components/DaisyUI/DaisyUICustomToggle";
import AdminHeader from "../../../components/Admin/AdminHeader";
import AdminSidebar from "../../../components/Admin/AdminSidebar";

function Dashboard() {
  return (
    <div className="py-[4rem] grid">
      <div className="mx-[12rem] grid grid-cols-12 gap-x-[3rem]">
        <AdminHeader />
        <span className="col-span-12 text-center font-medium text-[2.4rem] leading-[2.4rem] mt-[80px] mb-[8px] dark:text-textColor-dark">
          Dashboard
        </span>
        <div class="col-span-2">
          <AdminSidebar />
        </div>
        <div class="col-span-9">
          <p className="font-semibold text-[1.6rem] leading-[2.4rem] mt-[20px] dark:text-textColor-dark ">
            This is the best admin panel ever
          </p>
          <span className="mt-[40px] flex text-[1.3rem] leading-[2.4rem] dark:text-textColor-dark">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil
            consequuntur atque temporibus accusamus saepe quod dolorem incidunt
            harum unde, tempora, non animi quas reprehenderit ipsum. Minima ex
            natus dolores blanditiis? Numquam sed, quasi perspiciatis eaque
            tempore culpa animi neque maxime magnam cum, ullam nesciunt, illo
            voluptate a quae fugit voluptatem ipsum. Facilis ratione delectus
            adipisci eveniet repellat cupiditate ducimus eligendi. Dolorem
            obcaecati delectus nemo necessitatibus consectetur atque cum aperiam
            quis eos fugit numquam vel quaerat consequuntur commodi hic, magnam
            fuga doloribus provident odit quam repellendus sit at dolore.
            Libero, dicta! Sit, quaerat? Voluptatum, molestias ducimus, omnis
            laudantium iure totam voluptate fuga esse expedita fugiat enim
            incidunt ipsa voluptatibus reiciendis sed minus accusamus deserunt?
            Eos minima repudiandae consequuntur ipsa corrupti. Doloremque!
            Veniam quos, ipsam fugit excepturi sed eligendi consequuntur ex.
            Incidunt fugiat optio vitae excepturi esse, ducimus aperiam,
            recusandae sequi delectus rerum laudantium blanditiis asperiores,
            quas maiores assumenda minus? Labore, maiores. Lorem ipsum dolor sit
            amet consectetur, adipisicing elit. Nihil consequuntur atque
            temporibus accusamus saepe quod dolorem incidunt harum unde,
            tempora, non animi quas reprehenderit ipsum. Minima ex natus dolores
            blanditiis? Numquam sed, quasi perspiciatis eaque tempore culpa
            animi neque maxime magnam cum, ullam nesciunt, illo voluptate a quae
            fugit voluptatem ipsum. Facilis ratione delectus adipisci eveniet
            repellat cupiditate ducimus eligendi. Dolorem obcaecati delectus
            nemo necessitatibus consectetur atque cum aperiam quis eos fugit
            numquam vel quaerat consequuntur commodi hic, magnam fuga doloribus
            provident odit quam repellendus sit at dolore. Libero, dicta! Sit,
            quaerat? Voluptatum, molestias ducimus, omnis laudantium iure totam
            voluptate fuga esse expedita fugiat enim incidunt ipsa voluptatibus
            reiciendis sed minus accusamus deserunt? I have no idea what to put
            in here, so I’m gonna type something random and no shot someone
            gonna read this. Incidunt fugiat optio vitae excepturi esse, ducimus
            aperiam, recusandae sequi delectus rerum laudantium blanditiis
            asperiores, quas maiores assumenda minus? Labore, maiores.
            
          </span>
        </div>
        <div class="col-span-1"></div>

        <div class="absolute bottom-[80px]">
          <DaisyUICustomToggle />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
