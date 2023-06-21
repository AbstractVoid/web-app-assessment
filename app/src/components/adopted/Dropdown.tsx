import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid"
import { classNames } from "@/shared/helpers";

type Item = string;

interface IDropdown {
    items: Item[]
    activeItem?: Item
    onChange: (newItem: Item) => void
}

const Dropdown: React.FC<IDropdown> = ({ items, activeItem, onChange }) => {

  return (
    <div className="relative z-[10]">
      <Listbox value={activeItem} onChange={onChange}>
        <Listbox.Button className="bg-white shadow rounded-lg px-4 py-3 flex hover:bg-slate-50 border-[1px] border-slate-200">
          {activeItem}
          <ChevronDownIcon className="text-black h-5 w-5 my-auto ml-2" />
        </Listbox.Button>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className="absolute bg-white shadow-lg rounded-lg  w-full">
            {items.map((item, i) => (
                <Listbox.Option
                  as="button"
                  key={i}
                  value={item}
                  className="block w-full"
                >
                {({ active }) => (
                  <span className={classNames("px-4 py-3 w-full block", active ? "bg-slate-100" : "hover:bg-slate-50")}>
                    {item}
                  </span>  
                )}
                </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default Dropdown;
