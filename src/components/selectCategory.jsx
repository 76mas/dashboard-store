import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiselect";
import { useStatment } from "@/context/maping";

export default function SelectCategory({ categorys, mapget = null }) {
  const { map, setMap } = useStatment();
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!categorys) return;

    const opts = categorys.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));

    setOptions(opts);
    if (Array.isArray(mapget) && mapget.length > 0) {
      setSelected(
        opts.filter((i) =>
          mapget.some((m) => m.category_id === Number(i.value))
        )
      );
    } else {
      setSelected(opts.slice(0, 2));
      console.log("mapget", mapget);
    }
  }, [categorys, mapget]);

  useEffect(() => {
    setMap(selected.map((c) => ({ category_id: Number(c.value) })));
    console.log(
      "map",
      selected.map((c) => ({ category_id: Number(c.value) }))
    );
  }, [selected, setMap]);

  console.log("map", map);
  if (!options.length) return null;
  return (
    <div className="*:not-first:mt-2 w-[97%]">
      <Label className="text-[#929292]">Select Category</Label>
      <MultipleSelector
        defaultOptions={options}
        value={selected}
        onValueChange={setSelected}
        placeholder="Select Categories"
        onChange={(c) => {
          setMap(c.map((e) => ({ category_id: Number(e.value) })));
        }}
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
      />
    </div>
  );
}
