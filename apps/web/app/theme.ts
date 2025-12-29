'use client';

import { createTheme } from '@mui/material/styles';

const AMEX_BLUE = '#006FCF';
const AMEX_DEEP_BLUE = '#00175A'; // Brand Heritage Blue
const AMEX_LIGHT_BLUE = '#00A3E0'; // Accent
const NEUTRAL_BG = '#F4F6F8'; // Clean Workspace Background
const WHITE = '#FFFFFF';

export const theme = createTheme({
    palette: {
        mode: 'light', // Switch to light for readability/clean look
        primary: {
            main: AMEX_BLUE,
        },
        secondary: {
            main: AMEX_LIGHT_BLUE,
        },
        background: {
            default: NEUTRAL_BG,
            paper: WHITE,
        },
        text: {
            primary: '#2C2C2C', // Soft Black
            secondary: '#545454',
        }
    },
    typography: {
        fontFamily: '"Benton Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        h4: { fontWeight: 600, color: AMEX_DEEP_BLUE },
        h5: { fontWeight: 600, color: AMEX_DEEP_BLUE },
        h6: { fontWeight: 500 },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: AMEX_DEEP_BLUE,
                    color: WHITE,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: AMEX_DEEP_BLUE,
                    color: WHITE,
                    borderRight: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', // Soft premium shadow
                    border: '1px solid #E0E0E0',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 20, // Brand pill shape
                    textTransform: 'none',
                    fontWeight: 600,
                },
                contained: {
                    backgroundColor: AMEX_BLUE,
                    '&:hover': { backgroundColor: '#005BB5' },
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: WHITE,
                    borderRadius: 4, // Input fields standard rounded
                    '& fieldset': { borderColor: '#E0E0E0' },
                    '&:hover fieldset': { borderColor: AMEX_BLUE },
                    '&.Mui-focused fieldset': { borderColor: AMEX_BLUE, borderWidth: 2 },
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#F9FAFB',
                    color: '#545454',
                    fontWeight: 600,
                }
            }
        }
    },
});
