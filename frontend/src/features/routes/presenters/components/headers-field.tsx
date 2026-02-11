import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Trash2, Plus, AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"

export function HeadersField() {
    const { control, register } = useFormContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "headers",
    })

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    📋 Headers Personalizados
                </h3>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ key: "", value: "" })}
                    className="text-primary"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                </Button>
            </div>

            {/* Lista */}
            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex items-center gap-3 bg-muted/40 p-3 rounded-lg border"
                    >
                        <Input
                            placeholder="Content-Type"
                            {...register(`headers.${index}.key`)}
                        />

                        <span className="text-muted-foreground">:</span>

                        <Input
                            placeholder="application/json"
                            {...register(`headers.${index}.value`)}
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Info box */}
            <Alert variant={"default"} className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                <AlertCircleIcon />
                <AlertTitle>Informações Importantes</AlertTitle>
                <AlertDescription>Cabeçalhos definidos aqui serão injetados automaticamente em todas as requisições que passarem por esta rota antes de serem enviadas ao endpoint de destino.</AlertDescription>
            </Alert>

        </div>
    )
}
