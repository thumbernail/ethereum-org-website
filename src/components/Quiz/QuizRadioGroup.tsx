// Import libraries
import React, { useMemo } from "react"
import {
  Box,
  chakra,
  Circle,
  Flex,
  RadioProps,
  Text,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react"

// Import types
import { Question } from "../../types"

// Interfaces
export interface CustomRadioProps extends RadioProps {
  index: number
  label: string
}
export interface IProps {
  questionData: Question
  showAnswer: boolean
  handleSelection: (answerId: string) => void
  selectedAnswer: string | null
}

// Component
const QuizRadioGroup: React.FC<IProps> = ({
  questionData,
  showAnswer,
  handleSelection,
  selectedAnswer,
}) => {
  const { getRadioProps, getRootProps } = useRadioGroup({
    onChange: handleSelection,
  })
  const { prompt, answers, correctAnswerId } = questionData

  // Memoized values
  const explanation = useMemo<string>(() => {
    if (!selectedAnswer) return ""
    return answers.filter(({ id }) => id === selectedAnswer)[0].explanation
  }, [selectedAnswer])

  const isSelectedCorrect = useMemo<boolean>(
    () => correctAnswerId === selectedAnswer,
    [selectedAnswer]
  )

  // Custom radio button component
  const CustomRadio: React.FC<CustomRadioProps> = ({
    index,
    label,
    ...radioProps
  }) => {
    const { state, getInputProps, getCheckboxProps, htmlProps } =
      useRadio(radioProps)

    // Memoized values
    const buttonBg = useMemo<string>(() => {
      if (!state.isChecked) return "bodyInverted"
      if (!showAnswer) return "primary"
      if (!isSelectedCorrect) return "error"
      return "success"
    }, [state.isChecked, showAnswer, isSelectedCorrect])

    // Render CustomRadio component
    return (
      <chakra.label {...htmlProps} cursor="pointer" data-group w="100%">
        <input {...getInputProps({})} hidden />
        <Flex
          {...getCheckboxProps()}
          w="100%"
          p={2}
          alignItems="center"
          bg={buttonBg}
          color={state.isChecked ? "white" : "text"}
          borderRadius="base"
          _hover={{
            boxShadow: showAnswer ? "none" : "primary",
            outline: showAnswer
              ? "none"
              : "1px solid var(--eth-colors-primary)",
            cursor: showAnswer ? "default" : "pointer",
          }}
        >
          <Circle
            size="25px"
            bg={
              showAnswer
                ? "white"
                : state.isChecked
                ? "primaryPressed"
                : "disabled"
            }
            _groupHover={{
              bg: showAnswer ? "white" : "primaryPressed",
            }}
            me={2}
          >
            <Text
              m="0"
              fontWeight="700"
              fontSize="lg"
              color={
                !showAnswer ? "white" : isSelectedCorrect ? "success" : "error"
              }
            >
              {String.fromCharCode(97 + index).toUpperCase()}
            </Text>
          </Circle>
          {label}
        </Flex>
      </chakra.label>
    )
  }

  // Render QuizRadioGroup
  return (
    <Flex {...getRootProps()} direction="column" w="100%">
      <Text fontWeight="700" fontSize="2xl" mb={6}>
        {prompt}
      </Text>
      <Flex direction="column" gap={4}>
        {answers.map(({ id, label }, index) => {
          const display =
            !showAnswer || id === selectedAnswer ? "inline-flex" : "none"
          return (
            <CustomRadio
              key={id}
              display={display}
              index={index}
              label={label}
              {...getRadioProps({ value: id })}
            />
          )
        })}
      </Flex>
      {showAnswer && (
        <Box mt={5}>
          <Text fontWeight="bold" mt={0} mb={2}>
            Explanation
          </Text>
          <Text m={0}>{explanation}</Text>
        </Box>
      )}
    </Flex>
  )
}

export default QuizRadioGroup
