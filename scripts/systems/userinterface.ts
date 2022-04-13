import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent } from "../components/aoeentity"
import { RoundsComponent } from "../components/rounds"
import { PlayerComponent } from "../components/player"
import { HealthComponent } from "../components/health"
import { UserInterfaceComponent } from "../components/userinterface"

export type UserInterfaceSystemInputs = {
    userInterface: SingletonComponent<UserInterfaceComponent>
    rounds: SingletonComponent<RoundsComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    healths: EntityComponents<HealthComponent>
    players: EntityComponents<PlayerComponent>
}

const currentRoundBindingName = "currentRound"
const currentRoundElementName = "CurrentRound"
const currentRoundXaml = `
    <StackPanel HorizontalAlignment="Center" Orientation="Horizontal" xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation">
        <TextBlock FontSize="36" HorizontalAlignment="Center" Text="{Binding [${currentRoundBindingName}]}" Style="{StaticResource HUDPrimaryColorLightTitleTextBlock18ptStyle}" />
    </StackPanel>
`

export const userInterfaceSystem: System<UserInterfaceSystemInputs> = (components: UserInterfaceSystemInputs) => {
    const dataContext = {
        [currentRoundBindingName]: (components.rounds.currentRound + 1).toString(),
    }

    if (!components.userInterface.initialized) {
        components.userInterface.initialized = true

        UI_AddChild(
            "ScarDefault",
            "XamlPresenter",
            currentRoundElementName,
            {
                IsHitTestVisible: true,
                Xaml: currentRoundXaml,
                DataContext: UI_CreateDataContext(dataContext),
            }
        )
    } else {
        UI_SetDataContext(currentRoundElementName, dataContext)
    }
}
