import React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid"

type Item = string;

interface IDropdown {
    items: Item[]
    activeItem?: Item
    onChange: (newItem: Item) => void
}

const Dropdown: React.FC<IDropdown> = ({ items, activeItem, onChange }) => {

  return (
    <div className="relative z-[100]">
      <Listbox value={activeItem} onChange={onChange}>
        <Listbox.Button className="bg-white shadow rounded-lg px-4 py-3 flex hover:bg-slate-50">
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
          <Listbox.Options className="absolute bg-white shadow-lg rounded-lg">
            {items.map((item, i) => (
              <Listbox.Option
                as="button"
                key={i}
                value={item}
                className="px-4 py-3 block hover:bg-slate-50 w-full"
              >
                {item}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
};

export default Dropdown;
