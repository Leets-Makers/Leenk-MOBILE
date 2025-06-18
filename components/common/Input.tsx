import { View, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  title?: string;
  subMessage?: string;
}

export default function Input({ title, placeholder, subMessage }: InputProps) {}
