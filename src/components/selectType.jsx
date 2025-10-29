import { useEffect, useId, useState } from "react";
import { RiGatsbyLine, RiNextjsLine, RiReactjsLine } from "@remixicon/react";
import { SiSinglestore } from "react-icons/si";
import { FaListOl } from "react-icons/fa";
import { TbSlideshow } from "react-icons/tb";
import { TbCategory } from "react-icons/tb";
import { TfiTimer } from "react-icons/tfi";
import { Label } from "@/components/ui/label";
import { useStatment } from "@/context/maping";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectType({ type }) {
  const { setBannerType } = useStatment();
  const [selectedType, setSelectedType] = useState(type ?? "");
  useEffect(() => {
    if (type) setSelectedType(type);
  }, [type]);

  console.log(type);
  const id = useId();

  return (
    <div className="*:not-first:mt-2 w-[97%]">
      <Label className="text-[#929292]" htmlFor={id}>
        Select Type of Categorise
      </Label>
      <Select
        onValueChange={(e) => {
          setBannerType(e);
          setSelectedType(e);
        }}
        value={selectedType}
      >
        <SelectTrigger
          id={id}
          className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center !text-[#ffffffa8] [&>span]:gap-2 [&>span_svg]:shrink-0"
        >
          <SelectValue placeholder="Select Categorise" />
        </SelectTrigger>

        <SelectContent
          className="[&_*[role=option]>span>svg]:text-muted-foreground/80  
                     bg-[#000] 
                     [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8  !text-[#ffffffa8]
                     [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 
                     [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center 
                     [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0
                     [&_*[role=option]:hover]:bg-[#1a1a1a]
                     [&_*[role=option]]:transition-colors [&_*[role=option]]:duration-200"
        >
          <SelectItem value="single">
            <SiSinglestore size={16} aria-hidden="true" />
            <span className="truncate !text-[#ffffffa8]">single</span>
          </SelectItem>
          <SelectItem value="slides">
            <TbSlideshow size={16} aria-hidden="true" />
            <span className="truncate text-[#ffffffa8]">slides</span>
          </SelectItem>
          <SelectItem value="List">
            <FaListOl size={16} aria-hidden="true" />
            <span className="truncate text-[#ffffffa8]">List</span>
          </SelectItem>
          <SelectItem value="Timer">
            <TfiTimer size={16} aria-hidden="true" />
            <span className="truncate text-[#ffffffa8]">Timer</span>
          </SelectItem>

          <SelectItem value="Category">
            <TbCategory size={16} aria-hidden="true" />
            <span className="truncate text-[#ffffffa8]">Category</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}