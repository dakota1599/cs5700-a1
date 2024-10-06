type SectionProps = React.PropsWithChildren<{
    title: string
}>

/**
 * @returns ReactNode
 * A reusable styling component.
 */
export const Section = ({ title, children }: SectionProps) => {
    return (
        <div className="w-full">
            <h3 className="text-center">{title}</h3>
            <div className="flex flex-col w-full border-cyan-800 rounded-lg border-2 p-3 gap-4">
                {children}
            </div>
        </div>
    )
}
