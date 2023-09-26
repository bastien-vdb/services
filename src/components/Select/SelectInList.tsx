import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select"


export const SelectInList = () => {
    return (
        <Select>
            <SelectTrigger onClick={() => alert('ok')} className="w-[180px]">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem onSelect={() => alert('ca sélectionne')} value="light">Light</SelectItem>
                <SelectItem onClick={() => alert('alooo')} value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
            </SelectContent>
        </Select>

    )
}