// ----------------------------------------------------------------------

export default function Input(theme) {
    return {
        MuiInputBase: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...({
                        color: theme.palette[ownerState.variant].contrastText,
                        backgroundColor: theme.palette[ownerState.variant].main,
                      }),
                  }),
            },
        },
    };
}
