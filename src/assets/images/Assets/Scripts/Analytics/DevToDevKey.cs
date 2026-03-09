namespace Analytics
{
    public enum DevToDevKey
    {
        app_opened = 0,
        app_version = 1,
        main_scene_loaded = 2,

        //Onboarding
        start_onboarding_steps = 3,
        onboarding_step = 4,
        first_onboarding_started_1 = 5,
        first_pet_selected_2 = 6,
        first_pet_named_3 = 7,
        first_step_goal_set_4 = 8,
        permissions_granted_5 = 9,

        //Tutorial
        tutorial_steps = 10,
        tutorial_step = 11,
        tutorial_started_1 = 12,
        egg_tapped_2 = 13,
        egg_destroyed_3 = 14,
        meet_pet_closed_4 = 15,
        care_loop_explanation_closed_5 = 16,
        step_goal_explanation_closed_6 = 17,
        sick_dead_explanation_closed_7 = 18,
        maturation_explanation_closed_8 = 19,
        feed_action_completed_9 = 20,
        rest_actions_explanation_closed_10 = 21,
        pet_menu_opened_11 = 22,
        pet_menu_closed_12 = 23,
        final_explanation_closed_13 = 24,

        //Gameplay Events
        steps_progress = 25,
        percent_reached = 26,

        action_performed = 27,
        action = 28,
        feed = 29,
        water = 30,
        clean = 31,
        treat = 32,
        percent_when = 33,

        daily_result = 34,
        all_done = 35,
        missed_consecutive = 36,
        current_streak = 37,
        current_state = 38,
        mature_stage = 39,
        baby = 40,
        teen = 41,
        adult = 42,
        pet_age = 43,
        healthy = 44,
        sick = 45,
        very_sick = 46,
        dead = 47,

        daily_stats = 48,
        missed_total = 49,
        best_streak = 50,
        total_dead_pets = 51,
        total_grown_pets = 52,

        pet_evolve = 53,
        state_from = 54,
        state_to = 55,

        pet_dead = 56,
        days_lived = 57,

        revive_attempt = 58,
        result = 59,
        success = 60,
        cancel = 61,

        pet_born = 62,
        species = 63,
        cat = 64,
        dog = 65,
        dino = 66,
        is_restart = 67,

        //Main
        home_screen_opened = 68,
        statistics_screen_opened = 69,
        graveyard_screen_opened = 70,
        settings_screen_opened = 71,
        sound = 72,
        music = 73,
        value = 74,
        off = 75,
        on = 76,
        restore_purchases_clicked = 77,
        privacy_policy_clicked = 78,
        email_support = 79,
        pet_menu_opened = 80,
        step_goal_changed = 81,
        goal_prev = 82,
        goal_new = 83,
        source = 103,
        settings_screen = 104,
        permissions_screen = 105,
        subscription_screen = 106,

        //In-Apps
        in_app_purchase = 96,
        type = 97,
        revive_5 = 98,

        //Subscription
        subscription_purchased = 84,
        plan = 85,
        subscription_trial_started = 86,
        subscription_info = 87,
        subscription_status = 88,
        Purchased = 89,
        Inactive = 90,
        subscription_is_in_trial = 91,
        subscription_payment_failed = 92,
        subscription_restore_purchases = 93,

        annual = 99,
        monthly = 100,
        weekly = 101,
        none = 102,
        
        collection_screen_opened = 103,
    }
}