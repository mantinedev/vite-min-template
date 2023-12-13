import {
	Button,
	ButtonVariant,
	DefaultMantineColor,
	Fieldset,
	Grid,
	Space,
	TextInput,
	Tooltip,
} from '@mantine/core'
import { useFocusWithin, useWindowEvent } from '@mantine/hooks'
import { evaluate } from 'mathjs'
import { useEffect, useState } from 'react'
import { Window } from '../../components/window'
import { useTasks } from '../../hooks/use-tasks'
import manifest from './manifest'

export default function Calculator() {
	return (
		<Window manifest={manifest}>
			<ContentClassic />
		</Window>
	)
}

function ContentClassic() {
	const [equation, setEquation] = useState('')
	const [result, setResult] = useState('')

	useEffect(() => {
		const calculate = async () => {
			try {
				const result = equation !== '' ? await evaluate(equation) : ''
				setResult(String(result))
			} catch (error) {
				setResult('Error')
			}
		}

		calculate()
	}, [equation])

	type TypeButtonName =
		| 'AC'
		| '±'
		| '%'
		| '÷'
		| '7'
		| '8'
		| '9'
		| 'x'
		| '4'
		| '5'
		| '6'
		| '-'
		| '1'
		| '2'
		| '3'
		| '+'
		| '0'
		| '.'
		| '='

	function input(key: TypeButtonName) {
		if (key === 'AC') {
			setEquation('')
		}
		if (key === '±') {
			setEquation(`${equation.charAt(0) === '-' ? '' : '-'}${equation}`)
		}
		if (key === '%') {
			setEquation(`${equation}%`)
		}
		if (key === '÷') {
			setEquation(`${equation}/`)
		}
		if (key === 'x') {
			setEquation(`${equation}*`)
		}
		if (key === '-') {
			setEquation(`${equation}-`)
		}
		if (key === '+') {
			setEquation(`${equation}+`)
		}
		if (key === '=') {
			// Do nothing, already calculated
		}
		if (key === '.') {
			setEquation(`${equation}.`)
		}
		if (
			key === '0' ||
			key === '1' ||
			key === '2' ||
			key === '3' ||
			key === '4' ||
			key === '5' ||
			key === '6' ||
			key === '7' ||
			key === '8' ||
			key === '9'
		) {
			setEquation(`${equation}${key}`)
		}
	}

	const { taskIsFocused } = useTasks()

	const buttons: {
		id: TypeButtonName
		span?: number
		color?: DefaultMantineColor | undefined
		variant?: (string & object) | ButtonVariant | undefined
		key?: KeyboardEvent['key']
	}[] = [
		{
			id: 'AC',
			color: 'dark.6',
			variant: 'filled',
			key: 'Escape',
		},
		{
			id: '±',
			color: 'dark.6',
			variant: 'filled',
		},
		{
			id: '%',
			color: 'dark.6',
			variant: 'filled',
			key: '%',
		},
		{
			id: '÷',
			color: 'dark.6',
			variant: 'filled',
			key: '/',
		},
		{
			id: '7',
			key: '7',
		},
		{
			id: '8',
			key: '8',
		},
		{
			id: '9',
			key: '9',
		},
		{
			id: 'x',
			color: 'dark.6',
			variant: 'filled',
			key: 'x',
		},
		{
			id: '4',
			key: '4',
		},
		{
			id: '5',
			key: '5',
		},
		{
			id: '6',
			key: '6',
		},
		{
			id: '-',
			color: 'dark.6',
			variant: 'filled',
			key: '-',
		},
		{
			id: '1',
			key: '1',
		},
		{
			id: '2',
			key: '2',
		},
		{
			id: '3',
			key: '3',
		},
		{
			id: '+',
			color: 'dark.6',
			variant: 'filled',
			key: '+',
		},
		{
			id: '0',
			key: '0',
			span: 2,
		},
		{
			id: '.',
			key: '.',
		},
		{
			id: '=',
			variant: 'filled',
			key: 'Enter',
		},
	]

	const { ref, focused } = useFocusWithin()

	useWindowEvent('keydown', (e: KeyboardEvent) => {
		if (taskIsFocused('calculator') && !focused) {
			buttons.forEach((button) => {
				if (button.key === e.key) {
					e.preventDefault()
					e.stopPropagation()
					input(button.id)
				}
			})
		}
	})

	const [refEquation, setRefEquation] = useState<HTMLDivElement | null>(null)

	useEffect(() => {
		const timer = refEquation
			? setTimeout(() => {
					refEquation.focus()
			  }, 100)
			: false

		return () => {
			if (timer) clearTimeout(timer)
		}
	}, [refEquation])

	return (
		<>
			<TextInput
				ref={ref}
				pos={'relative'}
				component={'div'}
				value={result}
				onChange={() => {
					// Do nothing
				}}
				size={'xl'}>
				<Tooltip
					color={'dark.5'}
					withArrow
					position={'bottom-start'}
					offset={-5}
					label={'Resultado'}>
					<TextInput
						pos={'absolute'}
						top={'0.55em'}
						size={'xl'}
						p={0}
						w={'auto'}
						h={'auto'}
						variant={'unstyled'}
						value={result}
						onChange={(e) => {
							e.preventDefault()
							e.stopPropagation()
							//
						}}
					/>
				</Tooltip>
				<Tooltip
					color={'dark.5'}
					withArrow
					position={'top-start'}
					offset={5}
					label={'Ecuación'}>
					<TextInput
						ref={setRefEquation}
						opacity={0.5}
						size={'sm'}
						w={'auto'}
						h={'auto'}
						variant={'unstyled'}
						p={0}
						value={equation}
						onChange={(e) => {
							setEquation(e.target.value)
						}}
					/>
				</Tooltip>
			</TextInput>
			<Space h={12} />
			<Tooltip.Floating
				position={'top'}
				color={'dark.5'}
				label={'Esta sección está en desarrollo'}>
				<Fieldset
					disabled
					p={0}
					bg={'transparent'}
					style={{
						border: 'none',
					}}>
					<Grid
						gutter={8}
						columns={4}
						grow>
						{buttons.map((button) => {
							return (
								<Grid.Col
									key={`key-${button.id}`}
									span={button.span || 1}>
									<Button
										onClick={() => input(button.id)}
										fullWidth
										color={button.color || undefined}
										variant={button.variant || 'default'}>
										{button.id}
									</Button>
								</Grid.Col>
							)
						})}
					</Grid>
				</Fieldset>
			</Tooltip.Floating>
		</>
	)
}
