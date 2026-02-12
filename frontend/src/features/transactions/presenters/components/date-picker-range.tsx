import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Controller, type Control, type FieldErrors } from "react-hook-form"
import { type TransactionsForm } from "../../type"

interface DatePickerWithRangeProps {
    control: Control<TransactionsForm>
    errors: FieldErrors<TransactionsForm>
}

export function DatePickerWithRange({
    control,
    errors,
}: DatePickerWithRangeProps) {
    return (
        <Field className="w-60">
            <FieldLabel htmlFor="date">Data</FieldLabel>

            <Controller
                name="dateRange"
                control={control}
                render={({ field }) => {
                    const value = field.value as DateRange | undefined

                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="justify-start px-2.5 font-normal w-full"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />

                                    {value?.from ? (
                                        value.to ? (
                                            <>
                                                {format(value.from, "dd/MM/yyyy")} -{" "}
                                                {format(value.to, "dd/MM/yyyy")}
                                            </>
                                        ) : (
                                            format(value.from, "dd/MM/yyyy")
                                        )
                                    ) : (
                                        <span>Selecione uma data</span>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="range"
                                    selected={value}
                                    onSelect={(range) => field.onChange(range)}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    )
                }}
            />

            {errors.dateRange && (
                <FieldError>{errors.dateRange.message}</FieldError>
            )}
        </Field>
    )
}
